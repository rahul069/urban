import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class FindNearbyProvidersDto {
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @IsOptional()
  @IsNumber()
  radius?: number = 10; // Default 10km

  @IsOptional()
  @IsString()
  serviceType?: string;
}
