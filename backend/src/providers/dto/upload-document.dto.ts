import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UploadDocumentDto {
  @IsString()
  documentType: 'meisterbrief' | 'idCard' | 'insurance' | 'bankStatement' | 'hwk';

  @IsOptional()
  @IsString()
  hwkNumber?: string;

  @IsOptional()
  @IsDateString()
  insuranceExpiry?: string;
}