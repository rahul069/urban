import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/nestjs';
import { SentryModule as SentryNestModule } from '@sentry/nestjs/setup';

@Module({
  imports: [
    SentryNestModule.forRoot({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      debug: process.env.NODE_ENV === 'development',
      tracesSampleRate: 1.0,
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.Express({
          app: require('express')(),
        }),
      ],
      profilesSampleRate: 1.0,
    }),
  ],
  exports: [SentryNestModule],
})
export class SentryConfigModule {}