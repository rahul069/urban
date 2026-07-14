import { Injectable, NotFoundException, BadRequestException, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Provider } from './providers.entity';
import { Verification, VerificationStatus } from './verification.entity';
import { VerificationHistory } from './verification-history.entity';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateVerificationStatusDto } from './dto/update-verification-status.dto';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { addDays, isAfter } from 'date-fns';
import { VerificationService } from './verification.service';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(Provider)
    private providersRepository: Repository<Provider>,
    @InjectRepository(Verification)
    private verificationRepository: Repository<Verification>,
    @InjectRepository(VerificationHistory)
    private historyRepository: Repository<VerificationHistory>,
    @Inject(forwardRef(() => VerificationService))
    private verificationService: VerificationService,
  ) {}

  async createProvider(
    createProviderDto: CreateProviderDto,
  ): Promise<Provider> {
    const provider = this.providersRepository.create(createProviderDto);
    const savedProvider = await this.providersRepository.save(provider);

    const verification = this.verificationRepository.create({
      providerId: savedProvider.id,
    });
    await this.verificationRepository.save(verification);

    savedProvider.verification = verification;
    return this.providersRepository.save(savedProvider);
  }

  // Alias for getProviderById, kept for callers (InvoicesService,
  // PaymentsService) written against the CRUD-style findOne name.
  async findOne(id: string): Promise<Provider> {
    return this.getProviderById(id);
  }

  async getProviderById(id: string): Promise<Provider> {
    const provider = await this.providersRepository.findOne({
      where: { id },
      relations: { verification: true },
    });
    if (!provider) {
      throw new NotFoundException(`Provider with ID ${id} not found`);
    }
    return provider;
  }

  async getProviderByUserId(userId: string): Promise<Provider> {
    const provider = await this.providersRepository.findOne({
      where: { userId },
      relations: { verification: true },
    });
    if (!provider) {
      throw new NotFoundException(`Provider with user ID ${userId} not found`);
    }
    return provider;
  }

  async uploadDocument(
    providerId: string,
    documentType: UploadDocumentDto['documentType'],
    fileUrl: string,
    metadata?: { hwkNumber?: string; insuranceExpiry?: Date }
  ): Promise<Verification> {
    const provider = await this.getProviderById(providerId);
    const verification = await this.verificationRepository.findOne({
      where: { id: provider.verification.id },
    });

    if (!verification) {
      throw new NotFoundException('Verification record not found');
    }

    // Validate HWK number if provided
    if (documentType === 'hwk' && metadata?.hwkNumber) {
      const isValid = await this.verificationService.validateHwkNumberFormat(metadata.hwkNumber);
      if (!isValid) {
        throw new BadRequestException('Invalid HWK number format');
      }
    }

    // Validate insurance expiry if provided
    if (documentType === 'insurance' && metadata?.insuranceExpiry) {
      const isValid = await this.verificationService.validateInsuranceExpiry(metadata.insuranceExpiry);
      if (!isValid) {
        throw new BadRequestException('Insurance expiry date must be in the future');
      }
    }

    switch (documentType) {
      case 'meisterbrief':
        verification.meisterbriefUrl = fileUrl;
        break;
      case 'idCard':
        verification.idCardUrl = fileUrl;
        break;
      case 'insurance':
        verification.insuranceUrl = fileUrl;
        if (metadata?.insuranceExpiry) {
          verification.insuranceExpiry = metadata.insuranceExpiry;
        }
        break;
      case 'bankStatement':
        verification.bankStatementUrl = fileUrl;
        break;
      case 'hwk':
        if (!metadata?.hwkNumber) {
          throw new BadRequestException('HWK number is required');
        }
        verification.hwkNumber = metadata.hwkNumber;
        break;
      default:
        throw new BadRequestException('Invalid document type');
    }

    return this.verificationRepository.save(verification);
  }



  async updateVerificationStatus(
    providerId: string,
    updateVerificationStatusDto: UpdateVerificationStatusDto,
    changedBy?: string,
  ): Promise<Verification> {
    const provider = await this.getProviderById(providerId);
    return this.verificationService.updateVerificationStatus(
      provider.verification.id,
      updateVerificationStatusDto.status,
      updateVerificationStatusDto.rejectionReason,
      changedBy,
    );
  }

  async markHwkManuallyVerified(providerId: string, adminUserId: string): Promise<Verification> {
    const provider = await this.getProviderById(providerId);
    return this.verificationService.markHwkManuallyVerified(provider.verification.id, adminUserId);
  }



  async getPendingVerifications(): Promise<Verification[]> {
    return this.verificationRepository.find({
      where: { status: VerificationStatus.PENDING },
      relations: { history: true },
    });
  }



  async getExpiringVerifications(days: number): Promise<Verification[]> {
    const targetDate = addDays(new Date(), days);
    return this.verificationRepository.find({
      where: {
        insuranceExpiry: LessThan(targetDate),
        status: VerificationStatus.APPROVED,
      },
    });
  }

  async getVerificationHistory(providerId: string): Promise<VerificationHistory[]> {
    const provider = await this.getProviderById(providerId);
    return this.historyRepository.find({
      where: { verificationId: provider.verification.id },
      order: { createdAt: 'DESC' },
    });
  }
}
