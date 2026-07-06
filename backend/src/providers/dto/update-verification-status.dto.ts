import { IsEnum, IsOptional, IsString } from 'class-validator';
import { VerificationStatus } from '../verification.entity';

export class UpdateVerificationStatusDto {
  @IsEnum(VerificationStatus)
  status: VerificationStatus;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}