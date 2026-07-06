import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
  IsDecimal,
  IsNumber,
} from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @IsNotEmpty()
  @IsString()
  providerId: string;

  @IsNotEmpty()
  @IsString()
  serviceType: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  scheduledAt: Date;

  @IsOptional()
  @IsDecimal()
  estimatedPrice?: number;

  @IsOptional()
  @IsString()
  customerAddress?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}
