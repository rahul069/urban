import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  NotFoundException,
  StreamableFile,
  Req,
  Query
} from '@nestjs/common';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import 'multer';
import { ProvidersService } from './providers.service';
import { StorageService } from './storage.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateVerificationStatusDto } from './dto/update-verification-status.dto';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { Provider } from './providers.entity';
import { Verification } from './verification.entity';
import { VerificationHistory } from './verification-history.entity';

@Controller('providers')
export class ProvidersController {
  constructor(
    private readonly providersService: ProvidersService,
    private readonly storageService: StorageService,
  ) {}

  @Post()
  async createProvider(
    @Body() createProviderDto: CreateProviderDto,
  ): Promise<Provider> {
    return this.providersService.createProvider(createProviderDto);
  }

  @Get(':id')
  async getProvider(@Param('id') id: string): Promise<Provider> {
    return this.providersService.getProviderById(id);
  }

  @Get('user/:userId')
  async getProviderByUserId(
    @Param('userId') userId: string,
  ): Promise<Provider> {
    return this.providersService.getProviderByUserId(userId);
  }

  @Post(':id/documents')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @Param('id') id: string,
    @Body('documentType') documentType: UploadDocumentDto['documentType'],
    @UploadedFile() file: Express.Multer.File,
    @Body('hwkNumber') hwkNumber?: string,
    @Body('insuranceExpiry') insuranceExpiry?: string,
  ): Promise<Verification> {
    if (!file && documentType !== 'hwk') {
      throw new BadRequestException('No file uploaded');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    if (file && !allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Allowed types: JPEG, PNG, PDF',
      );
    }

    if (file && file.size > maxFileSize) {
      throw new BadRequestException('File size exceeds the limit of 5MB');
    }

    try {
      let fileUrl: string | null = null;
      if (file) {
        fileUrl = await this.storageService.uploadFile(file, id);
      }
      
      const metadata: { hwkNumber?: string; insuranceExpiry?: Date } = {};
      if (hwkNumber) {
        metadata.hwkNumber = hwkNumber;
      }
      if (insuranceExpiry) {
        metadata.insuranceExpiry = new Date(insuranceExpiry);
      }
      
      return this.providersService.uploadDocument(
        id,
        documentType,
        fileUrl || '',
        metadata,
      );
    } catch (error) {
      throw new BadRequestException('Failed to upload file to storage service');
    }
  }

  @Get('uploads/*path')
  serveUploadedFile(@Param('path') filePath: string[]): StreamableFile {
    const fullPath = path.join(__dirname, '../../../uploads', filePath.join('/'));
    if (!fs.existsSync(fullPath)) {
      throw new NotFoundException('File not found');
    }
    const file = fs.createReadStream(fullPath);
    return new StreamableFile(file);
  }

  @Put(':id/verification')
  async updateVerificationStatus(
    @Param('id') id: string,
    @Body() updateVerificationStatusDto: UpdateVerificationStatusDto,
    @Req() req: Request,
  ): Promise<Verification> {
    const changedBy = req.headers['x-user-id'] as string; // Temporary solution
    return this.providersService.updateVerificationStatus(
      id,
      updateVerificationStatusDto,
      changedBy,
    );
  }

  @Get('verification/pending')
  async getPendingVerifications(): Promise<Verification[]> {
    return this.providersService.getPendingVerifications();
  }

  @Put(':id/verification/hwk-verify')
  async markHwkManuallyVerified(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<Verification> {
    const adminUserId = req.headers['x-user-id'] as string; // Temporary solution
    return this.providersService.markHwkManuallyVerified(id, adminUserId);
  }

  @Get(':id/verification/history')
  async getVerificationHistory(
    @Param('id') id: string,
  ): Promise<VerificationHistory[]> {
    return this.providersService.getVerificationHistory(id);
  }

  @Get('verification/expiring')
  async getExpiringVerifications(
    @Query('days') days: number = 30,
  ): Promise<Verification[]> {
    return this.providersService.getExpiringVerifications(days);
  }


}
