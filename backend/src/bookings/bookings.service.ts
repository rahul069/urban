import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { Booking, BookingStatus } from './bookings.entity';
import { Provider } from '../providers/providers.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { FindNearbyProvidersDto } from './dto/find-nearby-providers.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(Provider)
    private providersRepository: Repository<Provider>,
  ) {}

  async createBooking(createBookingDto: CreateBookingDto): Promise<Booking> {
    const booking = this.bookingsRepository.create(createBookingDto);
    return this.bookingsRepository.save(booking);
  }

  async getBookingById(id: string): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: { provider: true },
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  async updateBookingStatus(
    id: string,
    updateBookingStatusDto: UpdateBookingStatusDto & { totalAmount?: number },
  ): Promise<Booking> {
    const booking = await this.getBookingById(id);
    booking.status = updateBookingStatusDto.status;
    booking.cancellationReason = updateBookingStatusDto.cancellationReason;
    if (updateBookingStatusDto.totalAmount !== undefined) {
      booking.totalAmount = updateBookingStatusDto.totalAmount;
    }
    return this.bookingsRepository.save(booking);
  }

  async getBookingsByCustomerId(customerId: string): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { customerId },
      relations: { provider: true },
    });
  }

  async getBookingsByProviderId(providerId: string): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { providerId },
      relations: { provider: true },
    });
  }

  async findNearbyProviders(
    findNearbyProvidersDto: FindNearbyProvidersDto,
  ): Promise<Provider[]> {
    const {
      latitude,
      longitude,
      radius = 10,
      serviceType,
    } = findNearbyProvidersDto;

    // Convert radius from km to degrees (approximate)
    const radiusInDegrees = radius / 111.32;

    const query = this.providersRepository
      .createQueryBuilder('provider')
      .where(
        `ST_DWithin(
        ST_MakePoint(:longitude, :latitude)::geography,
        ST_MakePoint(provider.longitude, provider.latitude)::geography,
        :radiusInMeters
      )`,
      )
      .andWhere('provider.isVerified = :isVerified', { isVerified: true })
      .setParameters({
        longitude,
        latitude,
        radiusInMeters: radius * 1000, // Convert km to meters
        isVerified: true,
      });

    if (serviceType) {
      query.andWhere('provider.serviceTypes @> ARRAY[:serviceType]', {
        serviceType,
      });
    }

    return query.getMany();
  }

  async getAvailableTimeSlots(providerId: string, date: Date): Promise<Date[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await this.bookingsRepository.find({
      where: {
        providerId,
        scheduledAt: Between(startOfDay, endOfDay),
        status: MoreThanOrEqual(BookingStatus.ACCEPTED),
      },
    });

    // In a real implementation, this would calculate available time slots
    // based on provider's working hours and existing bookings
    return [];
  }
}
