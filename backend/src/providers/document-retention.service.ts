import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, LessThanOrEqual } from 'typeorm';
import { Verification, VerificationStatus } from './verification.entity';
import { StorageService } from './storage.service';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { addDays, subDays } from 'date-fns';

@Injectable()
export class DocumentRetentionService {
  private readonly retentionPeriodDays: number;

  constructor(
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>,
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
  ) {
    // Default retention period: 10 years (3650 days) for tax compliance in Germany
    this.retentionPeriodDays = this.configService.get('DOCUMENT_RETENTION_DAYS') || 3650;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDocumentRetention() {
    await this.cleanupExpiredDocuments();
    await this.cleanupRejectedDocuments();
  }

  async cleanupExpiredDocuments(): Promise<void> {
    // Find documents that have exceeded the retention period
    const cutoffDate = subDays(new Date(), this.retentionPeriodDays);
    const expiredVerifications = await this.verificationRepository.find({
      where: {
        createdAt: LessThan(cutoffDate),
        // Only clean up documents that are not in active use
        status: VerificationStatus.APPROVED,
      },
    });

    for (const verification of expiredVerifications) {
      try {
        // Delete files from storage
        await this.deleteVerificationDocuments(verification);
        
        // Anonymize personal data in database
        await this.anonymizeVerificationData(verification);
        
        console.log(`Processed expired verification ${verification.id}`);
      } catch (error) {
        console.error(`Failed to process expired verification ${verification.id}:`, error);
      }
    }
  }

  async cleanupRejectedDocuments(): Promise<void> {
    // Find rejected documents older than 30 days
    const cutoffDate = subDays(new Date(), 30);
    const rejectedVerifications = await this.verificationRepository.find({
      where: {
        createdAt: LessThanOrEqual(cutoffDate),
        status: VerificationStatus.REJECTED,
      },
    });

    for (const verification of rejectedVerifications) {
      try {
        // Delete files from storage
        await this.deleteVerificationDocuments(verification);
        
        // Delete the verification record
        await this.verificationRepository.remove(verification);
        
        console.log(`Deleted rejected verification ${verification.id}`);
      } catch (error) {
        console.error(`Failed to delete rejected verification ${verification.id}:`, error);
      }
    }
  }

  private async deleteVerificationDocuments(verification: Verification): Promise<void> {
    const documentUrls = [
      verification.meisterbriefUrl,
      verification.idCardUrl,
      verification.insuranceUrl,
      verification.bankStatementUrl,
    ].filter((url): url is string => Boolean(url)); // Filter out undefined/null URLs

    for (const url of documentUrls) {
      try {
        await this.storageService.deleteFile(url);
      } catch (error) {
        console.error(`Failed to delete document ${url}:`, error);
        // Continue with other documents even if one fails
      }
    }
  }

  private async anonymizeVerificationData(verification: Verification): Promise<void> {
    // Anonymize personal data while preserving the record for compliance
    verification.meisterbriefUrl = undefined;
    verification.idCardUrl = undefined;
    verification.insuranceUrl = undefined;
    verification.bankStatementUrl = undefined;
    if (verification.hwkNumber) {
      verification.hwkNumber = this.anonymizeString(verification.hwkNumber);
    }
    if (verification.iban) {
      verification.iban = this.anonymizeString(verification.iban);
    }
    verification.providerId = this.anonymizeString(verification.providerId);

    // Mark as anonymized for audit purposes
    verification.status = VerificationStatus.ANONYMIZED;
    
    await this.verificationRepository.save(verification);
  }

  private anonymizeString(value: string): string {
    if (!value) return value;
    return `anonymized_${value.substring(0, 4)}_${value.length}`;
  }

  async anonymizeProviderData(providerId: string): Promise<void> {
    // Find all verifications for this provider
    const verifications = await this.verificationRepository.find({
      where: { providerId },
    });

    for (const verification of verifications) {
      await this.anonymizeVerificationData(verification);
    }
  }
}