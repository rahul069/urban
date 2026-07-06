import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async createPayment(@Body() paymentData: any) {
    return this.paymentsService.createPayment(paymentData);
  }

  @Get(':id')
  async getPaymentById(@Param('id') id: string) {
    return this.paymentsService.getPaymentById(id);
  }

  @Get('booking/:bookingId')
  async getPaymentsByBooking(@Param('bookingId') bookingId: string) {
    return this.paymentsService.getPaymentsByBooking(bookingId);
  }
}