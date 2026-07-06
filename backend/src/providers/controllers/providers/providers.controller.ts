import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ProvidersService } from '../../services/providers/providers.service';
import { Provider } from '../../entities/provider.entity';

@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post()
  create(@Body() providerData: Partial<Provider>): Promise<Provider> {
    return this.providersService.create(providerData);
  }

  @Get()
  findAll(): Promise<Provider[]> {
    return this.providersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Provider | null> {
    return this.providersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: Partial<Provider>): Promise<Provider | null> {
    return this.providersService.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.providersService.remove(id);
  }
}