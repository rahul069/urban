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
  getProviderById: jest.fn(),
};

const mockCustomersService = {
  getCustomerById: jest.fn(),
};

const mockStorageService = {
  uploadFile: jest.fn(),
};

const mockConfigService = {};

describe('InvoicesService', () => {
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createInvoice', () => {
    it('should create an invoice', async () => {
      const createInvoiceDto = {
        bookingId: 'test-booking-id',
        amount: 100.00,
        totalAmount: 100.00,
      };
      
      const booking = {
        id: 'test-booking-id',
        providerId: 'test-provider-id',
        customerId: 'test-customer-id',
        totalAmount: 100.00,
        serviceType: 'test-service',
      };
      
      const provider = {
        id: 'test-provider-id',
        firstName: 'Test',
        lastName: 'Provider',
      };
      
      const customer = {
        id: 'test-customer-id',
        firstName: 'Test',
        lastName: 'Customer',
      };
      
      const expectedInvoice = {
        id: 'test-invoice-id',
        ...createInvoiceDto,
        providerId: 'test-provider-id',
        customerId: 'test-customer-id',
        status: InvoiceStatus.DRAFT,
      };
      
      mockBookingsService.getBookingById.mockResolvedValue(booking);
      mockProvidersService.getProviderById.mockResolvedValue(provider);
      mockCustomersService.getCustomerById.mockResolvedValue(customer);
      mockInvoiceRepository.create.mockReturnValue(expectedInvoice);
      mockInvoiceRepository.save.mockResolvedValue(expectedInvoice);
      
      const result = await service.createInvoice(createInvoiceDto);
      
      expect(result).toEqual(expectedInvoice);
      expect(mockBookingsService.getBookingById).toHaveBeenCalledWith('test-booking-id');
      expect(mockProvidersService.getProviderById).toHaveBeenCalledWith('test-provider-id');
      expect(mockCustomersService.getCustomerById).toHaveBeenCalledWith('test-customer-id');
    });
  });

  describe('getInvoiceById', () => {
    it('should return an invoice by id', async () => {
      const expectedInvoice = {
        id: 'test-invoice-id',
        bookingId: 'test-booking-id',
        amount: 100.00,
        totalAmount: 100.00,
      };
      
      mockInvoiceRepository.findOne.mockResolvedValue(expectedInvoice);
      
      const result = await service.getInvoiceById('test-invoice-id');
      
      expect(result).toEqual(expectedInvoice);
      expect(mockInvoiceRepository.findOne).toHaveBeenCalledWith({ where: { id: 'test-invoice-id' } });
    });
  });
});