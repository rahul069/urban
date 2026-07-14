import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { Express } from 'express';
import 'multer';

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get('S3_BUCKET_NAME') || 'urban-documents';
    
    this.s3Client = new S3Client({
      region: this.configService.get('S3_REGION') || 'eu-central-1',
      endpoint: this.configService.get('S3_ENDPOINT'),
      forcePathStyle: true, // Required for Hetzner Object Storage
      credentials: {
        accessKeyId: this.configService.get('S3_ACCESS_KEY_ID') || '',
        secretAccessKey: this.configService.get('S3_SECRET_ACCESS_KEY') || '',
      },
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    providerId: string,
  ): Promise<string> {
    const key = `providers/${providerId}/${Date.now()}-${file.originalname}`;
    
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    
    await this.s3Client.send(command);
    
    return this.getFileUrl(key);
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const key = this.extractKeyFromUrl(fileUrl);
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3Client.send(command);
  }

  private extractKeyFromUrl(fileUrl: string): string {
    const prefix = `https://${this.bucketName}.${this.configService.get('S3_ENDPOINT').replace('https://', '')}/`;
    if (fileUrl.startsWith(prefix)) {
      return fileUrl.slice(prefix.length);
    }
    return new URL(fileUrl).pathname.replace(/^\//, '');
  }

  async generatePresignedUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    
    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 }); // 1 hour expiry
  }

  async getFileUrl(key: string): Promise<string> {
    return `https://${this.bucketName}.${this.configService.get('S3_ENDPOINT').replace('https://', '')}/${key}`;
  }
}