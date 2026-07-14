import { Injectable, NotFoundException, BadRequestException, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan } from 'typeorm';
import { Verification, VerificationStatus } from './verification.entity';
import { VerificationHistory } from './verification-history.entity';
import { ProvidersService } from './providers.service';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>,
    @InjectRepository(VerificationHistory)
    private readonly historyRepository: Repository<VerificationHistory>,
    @Inject(forwardRef(() => ProvidersService))
    private readonly providersService: ProvidersService,
    private readonly configService: ConfigService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async getVerificationById(id: string): Promise<Verification> {
    const verification = await this.verificationRepository.findOne({
      where: { id },
      relations: ['history'],
    });
    if (!verification) {
      throw new NotFoundException('Verification record not found');
    }
    return verification;
  }

  async getVerificationByProviderId(providerId: string): Promise<Verification> {
    const verification = await this.verificationRepository.findOne({
      where: { providerId },
      relations: ['history'],
    });
    if (!verification) {
      throw new NotFoundException('Verification record not found');
    }
    return verification;
  }

  async getPendingVerifications(): Promise<Verification[]> {
    return this.verificationRepository.find({
      where: { status: VerificationStatus.PENDING },
      relations: ['history'],
    });
  }

  async updateVerificationStatus(
    id: string,
    status: VerificationStatus,
    rejectionReason?: string,
    changedBy?: string,
  ): Promise<Verification> {
    const verification = await this.getVerificationById(id);

    if (
      status === VerificationStatus.APPROVED &&
      verification.hwkNumber &&
      !verification.hwkManuallyVerified
    ) {
      throw new BadRequestException(
        'HWK number must be manually confirmed against the Handwerkskammer register before approval. Call markHwkManuallyVerified first.',
      );
    }

    // Create history record
    const history = new VerificationHistory();
    history.verificationId = verification.id;
    history.status = status;
    history.notes = rejectionReason;
    history.changedBy = changedBy;
    await this.historyRepository.save(history);

    // Update verification
    verification.status = status;
    verification.rejectionReason = status === VerificationStatus.REJECTED ? rejectionReason : undefined;
    
    // Set next reverification date if approved
    if (status === VerificationStatus.APPROVED) {
      const now = new Date();
      verification.nextReverificationDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    }

    return this.verificationRepository.save(verification);
  }

  /**
   * Format-only check. Germany has no unified, public Handwerkskammer
   * registry API — each of the ~53 regional chambers maintains its own
   * register — so this cannot confirm the number is real. It only
   * rejects obviously malformed input at upload time. A human must
   * separately confirm the number via markHwkManuallyVerified() before
   * the verification can be approved; see updateVerificationStatus().
   */
  async validateHwkNumberFormat(hwkNumber: string): Promise<boolean> {
    const hwkRegex = /^[A-Z]{1,3}-\d{4,8}$/;
    return hwkRegex.test(hwkNumber);
  }

  /**
   * Records that an admin manually checked hwkNumber against the
   * relevant Handwerkskammer's own register. Required before a
   * verification carrying an hwkNumber can move to APPROVED.
   */
  async markHwkManuallyVerified(id: string, adminUserId: string): Promise<Verification> {
    const verification = await this.getVerificationById(id);
    verification.hwkManuallyVerified = true;
    verification.hwkVerifiedBy = adminUserId;
    verification.hwkVerifiedAt = new Date();
    return this.verificationRepository.save(verification);
  }

  async validateInsuranceExpiry(expiryDate: Date): Promise<boolean> {
    const now = new Date();
    const expiry = new Date(expiryDate);
    return expiry > now;
  }

  async checkDocumentRequirements(providerId: string): Promise<{ missing: string[] }> {
    const provider = await this.providersService.getProviderById(providerId);
    const verification = await this.getVerificationByProviderId(provider.verification.id);
    
    const missing = [];
    
    if (!verification.meisterbriefUrl) missing.push('meisterbrief');
    if (!verification.idCardUrl) missing.push('idCard');
    if (!verification.insuranceUrl) missing.push('insurance');
    if (!verification.iban) missing.push('iban');
    if (!verification.bankStatementUrl) missing.push('bankStatement');
    if (!verification.hwkNumber) missing.push('hwkNumber');
    
    return { missing };
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleReverificationReminders() {
    const now = new Date();
    const reminderThreshold = new Date();
    reminderThreshold.setDate(now.getDate() + 30); // 30 days before expiry
    
    const verifications = await this.verificationRepository.find({
      where: {
        status: VerificationStatus.APPROVED,
        nextReverificationDate: Between(now, reminderThreshold),
      },
    });
    
    for (const verification of verifications) {
      const provider = await this.providersService.getProviderById(verification.providerId);
      await this.notificationsService.sendReverificationReminder(
        provider.email,
        provider.firstName,
        verification.nextReverificationDate || new Date(),
      );
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleInsuranceExpiryReminders() {
    const now = new Date();
    const reminderThreshold = new Date();
    reminderThreshold.setDate(now.getDate() + 30); // 30 days before expiry
    
    const verifications = await this.verificationRepository.find({
      where: {
        status: VerificationStatus.APPROVED,
        insuranceExpiry: Between(now, reminderThreshold),
      },
    });
    
    for (const verification of verifications) {
      const provider = await this.providersService.getProviderById(verification.providerId);
       if (verification.insuranceExpiry) {
         await this.notificationsService.sendInsuranceExpiryReminder(
           provider.email,
           provider.firstName,
           verification.insuranceExpiry,
         );
       }
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleExpiredVerifications() {
    const now = new Date();
    
    const verifications = await this.verificationRepository.find({
      where: {
        status: VerificationStatus.APPROVED,
        nextReverificationDate: LessThan(now),
      },
    });
    
    for (const verification of verifications) {
      verification.status = VerificationStatus.EXPIRED;
      await this.verificationRepository.save(verification);
      
      const provider = await this.providersService.getProviderById(verification.providerId);
      await this.notificationsService.sendVerificationExpiredNotification(
        provider.email,
        provider.firstName,
      );
    }
  }
}