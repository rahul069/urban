import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentStatusDto } from '../dto/update-payment-status.dto';
import { Payment } from '../payment.entity';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async createPayment(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.paymentsService.createPayment(createPaymentDto);
  }

  @Put(':id/status')
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body() updatePaymentStatusDto: UpdatePaymentStatusDto,
  ): Promise<Payment> {
    return this.paymentsService.updatePaymentStatus(id, updatePaymentStatusDto);
  }

  @Get(':id')
  async getPaymentById(@Param('id') id: string): Promise<Payment> {
    return this.paymentsService.getPaymentById(id);
  }

  @Get('booking/:bookingId')
  async getPaymentsByBookingId(@Param('bookingId') bookingId: string): Promise<Payment[]> {
    return this.paymentsService.getPaymentsByBookingId(bookingId);
  }

  @Get('customer/:customerId')
  async getPaymentsByCustomerId(@Param('customerId') customerId: string): Promise<Payment[]> {
    return this.paymentsService.getPaymentsByCustomerId(customerId);
  }

  @Get('provider/:providerId')
  async getPaymentsByProviderId(@Param('providerId') providerId: string): Promise<Payment[]> {
    return this.paymentsService.getPaymentsByProviderId(providerId);
  }
}
