import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { BookingStatus } from '../bookings.entity';

export class UpdateBookingStatusDto {
  @IsNotEmpty()
  @IsEnum(BookingStatus)
  status: BookingStatus;

  @IsOptional()
  @IsString()
  cancellationReason?: string;

  @IsOptional()
  @IsNumber()
  totalAmount?: number;
}
