import { Module } from '@nestjs/common';
import { CustomersService } from './customers/customers.service';

@Module({
  providers: [CustomersService]
})
export class CustomersModule {}
