import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async createBooking(@Body() bookingData: any) {
    return this.bookingsService.createBooking(bookingData);
  }

  @Get(':id')
  async getBookingById(@Param('id') id: string) {
    return this.bookingsService.getBookingById(id);
  }

  @Put(':id/status')
  async updateBookingStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.bookingsService.updateBookingStatus(id, status);
  }

  @Get('customer/:customerId')
  async getBookingsByCustomer(@Param('customerId') customerId: string) {
    return this.bookingsService.getBookingsByCustomer(customerId);
  }

  @Get('provider/:providerId')
  async getBookingsByProvider(@Param('providerId') providerId: string) {
    return this.bookingsService.getBookingsByProvider(providerId);
  }
}