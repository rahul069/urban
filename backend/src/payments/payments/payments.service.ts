import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentMethod } from '../payment.entity';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentStatusDto } from '../dto/update-payment-status.dto';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { BookingsService } from '../../bookings/bookings.service';
import { BookingStatus } from '../../bookings/bookings.entity';
import { ProvidersService } from '../../providers/providers.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { CustomersService } from '../../customers/customers/customers.service';
import { InvoiceStatus } from '../../invoices/entities/invoice.entity';
import { InvoicesService } from '../../invoices/services/invoices/invoices.service';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly bookingsService: BookingsService,
    private readonly providersService: ProvidersService,
    private readonly configService: ConfigService,
    private readonly notificationsService: NotificationsService,
    private readonly customersService: CustomersService,
    private readonly invoicesService: InvoicesService,
  ) {
    const stripeSecretKey = this.configService.get('STRIPE_SECRET_KEY') || 'sk_test_placeholder';
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16' as any,
    });
  }

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const { bookingId, amount, paymentMethod } = createPaymentDto;

    // Get booking details
    const booking = await this.bookingsService.getBookingById(bookingId);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Validate amount matches booking total
    if (amount !== booking.totalAmount) {
      throw new BadRequestException('Payment amount does not match booking total');
    }

    // Create payment record
    const payment = this.paymentRepository.create({
      amount,
      paymentMethod,
      bookingId: booking.id,
      providerId: booking.providerId,
      customerId: booking.customerId,
      status: PaymentStatus.PENDING,
    });

    const savedPayment = await this.paymentRepository.save(payment);

    // If payment method is credit card, create Stripe payment intent
    if (paymentMethod === PaymentMethod.CREDIT_CARD) {
      const paymentIntent = await this.createStripePaymentIntent(savedPayment);
      savedPayment.stripePaymentIntentId = paymentIntent.id;
      return this.paymentRepository.save(savedPayment);
    }

    return savedPayment;
  }

  private async createStripePaymentIntent(payment: Payment): Promise<Stripe.PaymentIntent> {
    try {
       // Create or retrieve Stripe customer
       let stripeCustomerId = 'temp-customer-id'; // Placeholder since we don't have customer service yet
       if (!stripeCustomerId) {
        const stripeCustomer = await this.stripe.customers.create({
          email: 'customer@example.com', // Placeholder
          name: 'Customer Name', // Placeholder
        });
        stripeCustomerId = stripeCustomer.id;
      }

      // Create payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(payment.amount * 100), // Convert to cents
        currency: 'eur',
        customer: stripeCustomerId,
        payment_method_types: ['card'],
        metadata: {
          paymentId: payment.id,
          bookingId: payment.bookingId,
          providerId: payment.providerId,
          customerId: payment.customerId || null,
        },
      });

      return paymentIntent;
    } catch (error) {
      throw new BadRequestException(`Failed to create payment intent: ${error.message}`);
    }
  }

  async updatePaymentStatus(paymentId: string, updatePaymentStatusDto: UpdatePaymentStatusDto): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { id: paymentId } });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const { status, transactionId, invoiceUrl } = updatePaymentStatusDto;

    // Update payment status
    payment.status = status;
    payment.transactionId = transactionId || payment.transactionId;
    payment.invoiceUrl = invoiceUrl || payment.invoiceUrl;

    const updatedPayment = await this.paymentRepository.save(payment);

    // If payment is completed, update booking status and send notifications
    if (status === PaymentStatus.COMPLETED) {
      await this.bookingsService.updateBookingStatus(payment.bookingId, { status: BookingStatus.COMPLETED });
       
      // Send notifications
      const booking = await this.bookingsService.getBookingById(payment.bookingId);
      const provider = await this.providersService.getProviderById(payment.providerId);

      // Send payment confirmation to provider
      await this.notificationsService.sendEmail(
        provider.email,
        'Zahlungseingang',
        this.generatePaymentReceivedEmail(provider.firstName, payment.amount, booking.serviceType),
      );

      if (!payment.customerId) {
        console.error(`Payment ${payment.id} has no customerId; skipping invoice generation.`);
        return updatedPayment;
      }
      const customer = await this.customersService.findOne(payment.customerId);

      // Generate invoice automatically
      try {
        const invoice = await this.invoicesService.createInvoice({
          bookingId: payment.bookingId,
          amount: payment.amount,
          totalAmount: payment.amount,
          description: `Rechnung für ${booking.serviceType}`,
          issueDate: new Date().toISOString(),
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
          status: InvoiceStatus.SENT,
        });
        
        // Generate PDF and XML
        const pdfUrl = await this.invoicesService.generateInvoicePdf(invoice.id);
        const xmlUrl = await this.invoicesService.generateZugferdXml(invoice.id);
        
        // Update payment with invoice URL
        payment.invoiceUrl = pdfUrl;
        await this.paymentRepository.save(payment);
        
        // Send invoice to customer
        await this.notificationsService.sendEmail(
          customer.email,
          'Ihre Rechnung von Urban',
          this.generateInvoiceEmail(customer.firstName, invoice.invoiceNumber || invoice.id, pdfUrl),
        );
      } catch (error) {
        console.error('Failed to generate invoice:', error);
      }
    }

    return updatedPayment;
  }

  async getPaymentById(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['booking'],
    });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return payment;
  }

  async getPaymentsByBookingId(bookingId: string): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { bookingId },
      order: { createdAt: 'DESC' },
    });
  }

  async getPaymentsByCustomerId(customerId: string): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
    });
  }

  async getPaymentsByProviderId(providerId: string): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { providerId },
      order: { createdAt: 'DESC' },
    });
  }

  private generatePaymentConfirmationEmail(name: string, amount: number, serviceType: string): string {
    return `
      <p>Hallo ${name},</p>
      <p>Ihre Zahlung in Höhe von ${amount.toFixed(2)} € für ${serviceType} wurde erfolgreich bearbeitet.</p>
      <p>Vielen Dank für Ihre Zahlung!</p>
      <p>Mit freundlichen Grüßen,<br/>Das Urban Team</p>
    `;
  }

  private generatePaymentReceivedEmail(name: string, amount: number, serviceType: string): string {
    return `
      <p>Hallo ${name},</p>
       <p>Die Zahlung in Höhe von ${typeof amount === 'number' ? amount.toFixed(2) : amount} € für ${serviceType} wurde erfolgreich erhalten.</p>
      <p>Der Betrag wird in Kürze auf Ihr Konto überwiesen.</p>
      <p>Mit freundlichen Grüßen,<br/>Das Urban Team</p>
    `;
  }

  private generateInvoiceEmail(name: string, invoiceNumber: string, pdfUrl: string): string {
    return `
      <p>Hallo ${name},</p>
      <p>vielen Dank für Ihren Auftrag. Im Anhang finden Sie die Rechnung ${invoiceNumber} für Ihre erbrachte Leistung.</p>
      <p>Sie können die Rechnung auch unter folgendem Link herunterladen: <a href="${pdfUrl}">Rechnung herunterladen</a></p>
      <p>Mit freundlichen Grüßen,<br/>Das Urban Team</p>
    `;
  }
}
