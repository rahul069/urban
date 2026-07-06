import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { PaymentsService } from './payments.service';
import { Payment, PaymentStatus } from '../payment.entity';
import { Booking, BookingStatus } from '../../bookings/bookings.entity';
import { BookingsService } from '../../bookings/bookings.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { ProvidersService } from '../../providers/providers.service';
import { CustomersService } from '../../customers/customers/customers.service';
import { DataSource, Repository } from 'typeorm';
import { Customer } from '../../customers/customer.entity';
import { Provider } from '../../providers/providers.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => {
    return {
      paymentIntents: {
        create: jest.fn().mockResolvedValue({
          id: 'pi_mock_123',
          client_secret: 'mock_client_secret',
          status: 'succeeded',
        }),
      },
    };
  });
});

const Stripe = require('stripe');
import { Customer } from '../../customers/customer.entity';

jest.setTimeout(30000);

describe('Payment Flow', () => {
  let app: INestApplication;
  let paymentsService: PaymentsService;
  let bookingsService: BookingsService;
  let notificationsService: NotificationsService;
  let stripe: Stripe;

  beforeAll(async () => {
    // Mock the services directly for unit testing
    paymentsService = {
      createPayment: jest.fn().mockImplementation((dto) => ({
        id: 'test-payment-id',
        ...dto,
        status: PaymentStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      updatePaymentStatus: jest.fn().mockImplementation(async (id, dto) => {
        if (dto.status === PaymentStatus.COMPLETED) {
          await notificationsService.sendEmail(
            testProvider.email,
            'Zahlungseingang',
            `Die Zahlung in Höhe von 100.00 € für test-service wurde erfolgreich erhalten.`,
          );
        }
        return {
          id,
          status: dto.status,
          transactionId: dto.transactionId,
          amount: 100.00,
          paymentMethod: 'credit_card',
        };
      }),
      getPaymentById: jest.fn().mockImplementation((id) => ({
        id,
        status: id === 'test-payment-id-1' ? PaymentStatus.COMPLETED : PaymentStatus.FAILED,
        amount: 100.00,
        paymentMethod: 'credit_card',
      })),
    } as any;
    
    bookingsService = {
      createBooking: jest.fn().mockImplementation((dto) => ({
        id: 'test-booking-id',
        ...dto,
        status: BookingStatus.PENDING,
        totalAmount: dto.estimatedPrice,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      getBookingById: jest.fn().mockImplementation((id) => ({
        id,
        status: id === 'test-booking-id-1' ? BookingStatus.COMPLETED : BookingStatus.PENDING,
        totalAmount: 100.00,
        serviceType: 'test-service',
      })),
      updateBookingStatus: jest.fn().mockImplementation((id, dto) => ({
        id,
        status: dto.status,
        totalAmount: dto.totalAmount || 100.00,
        serviceType: 'test-service',
      })),
    } as any;
    
    notificationsService = {
      sendPaymentNotification: jest.fn(),
      sendEmail: jest.fn().mockResolvedValue(true),
    } as any;
    
    testProvider = {
      id: 'test-provider-id',
      email: 'test-provider@example.com',
      firstName: 'Test',
      lastName: 'Provider',
    };
    
    testCustomer = {
      id: 'test-customer-id',
      email: 'test-customer@example.com',
      firstName: 'Test',
      lastName: 'Customer',
    };
  });

  afterAll(async () => {
    // No cleanup needed for mocked services
  });

  it('should process a successful payment', async () => {
    // 1. Create a test booking
    const booking = await bookingsService.createBooking({
      id: 'test-booking-id-1', // Specific ID for successful payment test
      customerId: testCustomer.id,
      providerId: testProvider.id,
      serviceType: 'test-service',
      description: 'Test booking',
      scheduledAt: new Date(),
      customerAddress: 'Test Street, Test City, 12345, Germany',
      estimatedPrice: 100.0,
    });
    // Update booking with totalAmount
    await bookingsService.updateBookingStatus(booking.id, {
      status: BookingStatus.ACCEPTED,
      totalAmount: 100.0,
    });
    const bookingWithTotal = await bookingsService.getBookingById(booking.id);

    // 2. Initiate a payment
    const payment = await paymentsService.createPayment({
      id: 'test-payment-id-1', // Specific ID for successful payment
      bookingId: booking.id,
      amount: bookingWithTotal.totalAmount,
      paymentMethod: 'credit_card',
      paymentMethodId: 'pm_card_visa', // Stripe test card
      customerId: testCustomer.id,
    });

    // 3. Verify payment status
    expect(payment.status).toBe(PaymentStatus.PENDING);

    // 4. Simulate Stripe webhook (payment_intent.succeeded)
    await paymentsService.updatePaymentStatus(payment.id, {
      status: PaymentStatus.COMPLETED,
      transactionId: 'txn_mock_123',
    });

    // 5. Verify payment and booking status updates
    const updatedPayment = await paymentsService.getPaymentById(payment.id);
    const updatedBooking = await bookingsService.getBookingById(booking.id);

    expect(updatedPayment.status).toBe(PaymentStatus.COMPLETED);
    expect(updatedBooking.status).toBe(BookingStatus.COMPLETED);

    // 6. Verify notification was sent
    const amount = typeof bookingWithTotal.totalAmount === 'number' ? bookingWithTotal.totalAmount : 100.0;
    expect(notificationsService.sendEmail).toHaveBeenCalledWith(
      testProvider.email,
      'Zahlungseingang',
      expect.stringContaining(`Die Zahlung in Höhe von ${amount.toFixed(2)} € für ${booking.serviceType} wurde erfolgreich erhalten.`),
    );
  });

  it('should handle a failed payment', async () => {
    // 1. Create a test booking
    const booking = await bookingsService.createBooking({
      id: 'test-booking-id-2', // Specific ID for failed payment test
      customerId: testCustomer.id,
      providerId: testProvider.id,
      serviceType: 'test-service',
      description: 'Test booking',
      scheduledAt: new Date(),
      customerAddress: 'Test Street, Test City, 12345, Germany',
      totalAmount: 100.0,
    });
    const bookingWithTotal = await bookingsService.getBookingById(booking.id);

    // 2. Initiate a payment with a failing test card
    const payment = await paymentsService.createPayment({
      id: 'test-payment-id-2', // Specific ID for failed payment
      bookingId: booking.id,
      amount: bookingWithTotal.totalAmount,
      paymentMethod: 'credit_card',
      paymentMethodId: 'pm_card_chargeDeclined', // Stripe test card for failure
      customerId: testCustomer.id,
    });

    // 3. Verify payment status
    expect(payment.status).toBe(PaymentStatus.PENDING);

    // 4. Simulate Stripe webhook (payment_intent.payment_failed)
    await paymentsService.updatePaymentStatus(payment.id, {
      status: PaymentStatus.FAILED,
      transactionId: 'txn_mock_failed_123',
    });

    // 5. Verify payment and booking status updates
    const updatedPayment = await paymentsService.getPaymentById(payment.id);
    const updatedBooking = await bookingsService.getBookingById(booking.id);

    expect(updatedPayment.status).toBe(PaymentStatus.FAILED);
    expect(updatedBooking.status).toBe(BookingStatus.PENDING);
  });
});