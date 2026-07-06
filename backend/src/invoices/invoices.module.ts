import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesService } from './services/invoices/invoices.service';
import { InvoicesController } from './controllers/invoices/invoices.controller';
import { Invoice } from './entities/invoice.entity';
import { BookingsModule } from '../bookings/bookings.module';
import { ProvidersModule } from '../providers/providers.module';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice]),
    BookingsModule,
    ProvidersModule,
    CustomersModule,
  ],
  providers: [InvoicesService],
  controllers: [InvoicesController],
  exports: [InvoicesService],
})
export class InvoicesModule {}
