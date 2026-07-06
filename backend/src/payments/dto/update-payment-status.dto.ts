import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaymentStatus } from '../payment.entity';

export class UpdatePaymentStatusDto {
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @IsString()
  @IsOptional()
  transactionId?: string;

  @IsString()
  @IsOptional()
  invoiceUrl?: string;
}