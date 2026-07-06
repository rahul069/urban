import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { FindNearbyProvidersDto } from './dto/find-nearby-providers.dto';
import { Booking } from './bookings.entity';
import { Provider } from '../providers/providers.entity';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async createBooking(
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<Booking> {
    return this.bookingsService.createBooking(createBookingDto);
  }

  @Get(':id')
  async getBooking(@Param('id') id: string): Promise<Booking> {
    return this.bookingsService.getBookingById(id);
  }

  @Put(':id/status')
  async updateBookingStatus(
    @Param('id') id: string,
    @Body() updateBookingStatusDto: UpdateBookingStatusDto,
  ): Promise<Booking> {
    return this.bookingsService.updateBookingStatus(id, updateBookingStatusDto);
  }

  @Get('customer/:customerId')
  async getBookingsByCustomerId(
    @Param('customerId') customerId: string,
  ): Promise<Booking[]> {
    return this.bookingsService.getBookingsByCustomerId(customerId);
  }

  @Get('provider/:providerId')
  async getBookingsByProviderId(
    @Param('providerId') providerId: string,
  ): Promise<Booking[]> {
    return this.bookingsService.getBookingsByProviderId(providerId);
  }

  @Post('nearby-providers')
  async findNearbyProviders(
    @Body() findNearbyProvidersDto: FindNearbyProvidersDto,
  ): Promise<Provider[]> {
    return this.bookingsService.findNearbyProviders(findNearbyProvidersDto);
  }

  @Get('provider/:providerId/availability/:date')
  async getAvailableTimeSlots(
    @Param('providerId') providerId: string,
    @Param('date') date: Date,
  ): Promise<Date[]> {
    return this.bookingsService.getAvailableTimeSlots(
      providerId,
      new Date(date),
    );
  }
}
