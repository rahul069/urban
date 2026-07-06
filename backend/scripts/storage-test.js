#!/usr/bin/env node

const { StorageService } = require('../dist/providers/storage.service');
const { config } = require('dotenv');
const path = require('path');

// Load environment variables
config({ path: path.join(__dirname, '..', '.env') });

async function testStorageConnection() {
  try {
    const storageService = new StorageService();
    
    // Test a simple upload
    const testFile = {
      fieldname: 'test',
      originalname: 'test.txt',
      encoding: '7bit',
      mimetype: 'text/plain',
      buffer: Buffer.from('Test content'),
      size: 12,
    };
    
    const fileUrl = await storageService.uploadFile(testFile, 'tests');
    console.log('✅ Storage connection successful');
    console.log('Test file uploaded to:', fileUrl);
    
    // Test deletion
    await storageService.deleteFile(fileUrl);
    console.log('✅ File deletion successful');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Storage connection failed:', error.message);
    process.exit(1);
  }
}

testStorageConnection();