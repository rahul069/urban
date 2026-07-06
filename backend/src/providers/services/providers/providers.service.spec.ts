import { Test, TestingModule } from '@nestjs/testing';
import { ProvidersService } from './providers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Provider } from '../../entities/provider.entity';
import { Repository } from 'typeorm';

describe('ProvidersService', () => {
  let service: ProvidersService;
  let repository: Repository<Provider>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProvidersService,
        {
          provide: getRepositoryToken(Provider),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProvidersService>(ProvidersService);
    repository = module.get<Repository<Provider>>(getRepositoryToken(Provider));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});