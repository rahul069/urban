import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { Provider } from './providers.entity';
import { Verification } from './verification.entity';
import { VerificationHistory } from './verification-history.entity';
import { VerificationService } from './verification.service';
import { StorageService } from './storage.service';
import { DocumentRetentionService } from './document-retention.service';
import { CustomersModule } from '../customers/customers.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Provider, Verification, VerificationHistory]),
    forwardRef(() => CustomersModule),
    forwardRef(() => NotificationsModule),
  ],
  providers: [
    ProvidersService,
    VerificationService,
    StorageService,
    DocumentRetentionService,
  ],
  controllers: [ProvidersController],
  exports: [
    ProvidersService,
    VerificationService,
    StorageService,
    DocumentRetentionService,
  ],
})
export class ProvidersModule {}
