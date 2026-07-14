import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from './invoices.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Invoice, InvoiceStatus } from '../../entities/invoice.entity';
import { BookingsService } from '../../../bookings/bookings.service';
import { ProvidersService } from '../../../providers/providers.service';
import { CustomersService } from '../../../customers/customers/customers.service';
import { StorageService } from '../../../providers/storage.service';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

const mockInvoiceRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  remove: jest.fn(),
};

const mockBookingsService = {
  getBookingById: jest.fn(),
};

const mockProvidersService = {
  findOne: jest.fn(),
};

const mockCustomersService = {
  findOne: jest.fn(),
};

const mockStorageService = {
  uploadFile: jest.fn(),
};

const mockConfigService = {
  get: jest.fn(),
};

describe('InvoicesService Integration', () => {
  let service: InvoicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoicesService,
        {
          provide: getRepositoryToken(Invoice),
          useValue: mockInvoiceRepository,
        },
        {
          provide: BookingsService,
          useValue: mockBookingsService,
        },
        {
          provide: ProvidersService,
          useValue: mockProvidersService,
        },
        {
          provide: CustomersService,
          useValue: mockCustomersService,
        },
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('PDF Generation', () => {
    it('should generate a PDF invoice and upload it to storage', async () => {
      // Setup test data
      const testInvoice = {
        id: 'test-invoice-id',
        bookingId: 'test-booking-id',
        amount: 100.00,
        totalAmount: 100.00,
        status: InvoiceStatus.DRAFT,
        invoiceNumber: 'INV-2026-001',
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      };
      
      const testBooking = {
        id: 'test-booking-id',
        serviceType: 'Elektroinstallation',
        description: 'Steckdoseninstallation',
        scheduledAt: new Date(),
        totalAmount: 100.00,
        providerId: 'test-provider-id',
        customerId: 'test-customer-id',
      };
      
      const testProvider = {
        id: 'test-provider-id',
        firstName: 'Max',
        lastName: 'Mustermann',
        email: 'max@mustermann.de',
        phone: '+49 123 456789',
        address: 'Musterstraße 1',
        city: 'Berlin',
        postalCode: '10115',
        taxId: 'DE123456789',
      };
      
      const testCustomer = {
        id: 'test-customer-id',
        firstName: 'Anna',
        lastName: 'Schmidt',
        email: 'anna@schmidt.de',
        address: 'Kundenstraße 2',
        city: 'Berlin',
        postalCode: '10117',
      };
      
      // Mock repository and service calls
      mockInvoiceRepository.findOne.mockResolvedValue(testInvoice);
      mockBookingsService.getBookingById.mockResolvedValue(testBooking);
      mockProvidersService.findOne.mockResolvedValue(testProvider);
      mockCustomersService.findOne.mockResolvedValue(testCustomer);
      mockStorageService.uploadFile.mockResolvedValue('https://storage.example.com/invoices/test-invoice.pdf');
      
      // Test PDF generation
      const pdfUrl = await service.generateInvoicePdf('test-invoice-id');
      
      // Verify the result
      expect(pdfUrl).toBeDefined();
      expect(pdfUrl).toContain('https://storage.example.com/invoices/test-invoice.pdf');
      expect(mockStorageService.uploadFile).toHaveBeenCalled();
      
      // Verify invoice was updated
      expect(mockInvoiceRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        pdfUrl: 'https://storage.example.com/invoices/test-invoice.pdf',
        status: InvoiceStatus.SENT,
      }));
    });
  });

  describe('ZUGFeRD XML Generation', () => {
    it('should generate ZUGFeRD XML and upload it to storage', async () => {
      // Setup test data
      const testInvoice = {
        id: 'test-invoice-id',
        bookingId: 'test-booking-id',
        amount: 100.00,
        totalAmount: 100.00,
        status: InvoiceStatus.DRAFT,
        invoiceNumber: 'INV-2026-001',
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      };
      
      const testBooking = {
        id: 'test-booking-id',
        serviceType: 'Elektroinstallation',
        description: 'Steckdoseninstallation',
        scheduledAt: new Date(),
        totalAmount: 100.00,
        providerId: 'test-provider-id',
        customerId: 'test-customer-id',
      };
      
      const testProvider = {
        id: 'test-provider-id',
        firstName: 'Max',
        lastName: 'Mustermann',
        email: 'max@mustermann.de',
        phone: '+49 123 456789',
        address: 'Musterstraße 1',
        city: 'Berlin',
        postalCode: '10115',
        taxId: 'DE123456789',
      };
      
      const testCustomer = {
        id: 'test-customer-id',
        firstName: 'Anna',
        lastName: 'Schmidt',
        email: 'anna@schmidt.de',
        address: 'Kundenstraße 2',
        city: 'Berlin',
        postalCode: '10117',
      };
      
      // Mock repository and service calls
      mockInvoiceRepository.findOne.mockResolvedValue(testInvoice);
      mockBookingsService.getBookingById.mockResolvedValue(testBooking);
      mockProvidersService.findOne.mockResolvedValue(testProvider);
      mockCustomersService.findOne.mockResolvedValue(testCustomer);
      mockStorageService.uploadFile.mockResolvedValue('https://storage.example.com/invoices/test-invoice.xml');
      
      // Test XML generation
      const xmlUrl = await service.generateZugferdXml('test-invoice-id');
      
      // Verify the result
      expect(xmlUrl).toBeDefined();
      expect(xmlUrl).toContain('https://storage.example.com/invoices/test-invoice.xml');
      expect(mockStorageService.uploadFile).toHaveBeenCalled();
      
      // Verify invoice was updated
      expect(mockInvoiceRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        xmlUrl: 'https://storage.example.com/invoices/test-invoice.xml',
      }));
    });
  });
});