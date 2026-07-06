import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payment } from '../payment.entity';
import { BookingsService } from '../../bookings/bookings.service';
import { ProvidersService } from '../../providers/providers.service';
import { ConfigService } from '@nestjs/config';
import { NotificationsService } from '../../notifications/notifications.service';
import { InvoicesService } from '../../invoices/services/invoices/invoices.service';
import { CustomersService } from '../../customers/customers/customers.service';
import { Repository } from 'typeorm';

describe('PaymentsService', () => {
  it('should be defined', () => {
    expect(PaymentsService).toBeDefined();
  });
});
