import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProvidersService } from './providers.service';

@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get()
  async getProviders(@Query() query: any) {
    return this.providersService.getProviders(query);
  }

  @Get(':id')
  async getProviderById(@Param('id') id: string) {
    return this.providersService.getProviderById(id);
  }
}