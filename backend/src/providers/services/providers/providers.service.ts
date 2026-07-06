import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Provider } from '../../entities/provider.entity';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(Provider)
    private providersRepository: Repository<Provider>,
  ) {}

  async create(providerData: Partial<Provider>): Promise<Provider> {
    const provider = this.providersRepository.create(providerData);
    return this.providersRepository.save(provider);
  }

  async findAll(): Promise<Provider[]> {
    return this.providersRepository.find();
  }

  async findOne(id: string): Promise<Provider | null> {
    return this.providersRepository.findOneBy({ id });
  }

  async update(id: string, updateData: Partial<Provider>): Promise<Provider | null> {
    await this.providersRepository.update(id, updateData);
    return this.providersRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.providersRepository.delete(id);
  }
}