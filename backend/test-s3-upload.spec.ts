import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import { StorageService } from './providers/storage.service';
import { ProvidersService } from './providers/providers.service';
import { VerificationService } from './providers/verification.service';
import * as fs from 'fs';
import * as path from 'path';

jest.setTimeout(30000);

describe('S3/Hetzner Object Storage Integration', () => {
  let app: INestApplication;
  let storageService: StorageService;
  let providersService: ProvidersService;
  let verificationService: VerificationService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    storageService = moduleRef.get<StorageService>(StorageService);
    providersService = moduleRef.get<ProvidersService>(ProvidersService);
    verificationService = moduleRef.get<VerificationService>(VerificationService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should upload a file to S3/Hetzner Object Storage', async () => {
    // 1. Create a test provider
    const provider = await providersService.createProvider({
      email: `test-provider-${Date.now()}@example.com`,
      userId: `test-user-${Date.now()}`,
      firstName: 'Test',
      lastName: 'Provider',
      phone: '+1234567890',
      trade: 'Electrician',
    });

    // 2. Create a test file
    const testFilePath = path.join(__dirname, 'test-document.pdf');
    fs.writeFileSync(testFilePath, 'Test document content');

    // 3. Upload the file
    const file = {
      fieldname: 'document',
      originalname: 'test-document.pdf',
      encoding: '7bit',
      mimetype: 'application/pdf',
      buffer: fs.readFileSync(testFilePath),
      size: fs.statSync(testFilePath).size,
    } as Express.Multer.File;

    const fileUrl = await storageService.uploadFile(file, `providers/${provider.id}/documents`);
    expect(fileUrl).toBeDefined();

    // 4. Update provider verification with the file URL
    await providersService.uploadDocument(provider.id, 'meisterbrief', fileUrl);

    // 5. Verify the file URL is stored in the database
    const verification = await verificationService.getVerificationByProviderId(provider.id);
    expect(verification.meisterbriefUrl).toBe(fileUrl);

    // 6. Clean up
    fs.unlinkSync(testFilePath);
  });

  it('should handle upload failures gracefully', async () => {
    // 1. Mock a failing upload
    jest.spyOn(storageService, 'uploadFile').mockRejectedValueOnce(new Error('Upload failed'));

    // 2. Create a test provider
    const provider = await providersService.createProvider({
      email: `test-provider-${Date.now()}@example.com`,
      userId: `test-user-${Date.now()}`,
      firstName: 'Test',
      lastName: 'Provider',
      phone: '+1234567890',
      trade: 'Electrician',
    });

    // 3. Create a test file
    const testFilePath = path.join(__dirname, 'test-document.pdf');
    fs.writeFileSync(testFilePath, 'Test document content');

    const file = {
      fieldname: 'document',
      originalname: 'test-document.pdf',
      encoding: '7bit',
      mimetype: 'application/pdf',
      buffer: fs.readFileSync(testFilePath),
      size: fs.statSync(testFilePath).size,
    } as Express.Multer.File;

    // 4. Verify the upload fails
    await expect(
      storageService.uploadFile(file, `providers/${provider.id}/documents`),
    ).rejects.toThrow('Upload failed');

    // 5. Clean up
    fs.unlinkSync(testFilePath);
  });
});