import { IsNotEmpty, IsNumber, IsString, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { InvoiceStatus } from '../entities/invoice.entity';

export class CreateInvoiceDto {
  @IsUUID()
  @IsNotEmpty()
  bookingId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  @IsOptional()
  taxAmount?: number;

  @IsNumber()
  @IsOptional()
  discountAmount?: number;

  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  invoiceNumber?: string;

  @IsString()
  @IsOptional()
  issueDate?: string;

  @IsString()
  @IsOptional()
  dueDate?: string;

  @IsEnum(InvoiceStatus)
  @IsOptional()
  status?: InvoiceStatus;

  @IsString()
  @IsOptional()
  paymentTerms?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}