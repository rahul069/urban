import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { Customer } from '../customer.entity';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.customersService.create(createCustomerDto);
  }

  @Get(':id')
  async getCustomer(@Param('id') id: string): Promise<Customer> {
    return this.customersService.findOne(id);
  }

  @Get('by-user/:userId')
  async getCustomerByUserId(@Param('userId') userId: string): Promise<Customer> {
    return this.customersService.findByUserId(userId);
  }

  @Put(':id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.customersService.update(id, updateCustomerDto);
  }
}
