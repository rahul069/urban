import { Module } from '@nestjs/common';
import { SentryModule as SentryNestModule } from '@sentry/nestjs/setup';

// Sentry.init() itself runs in main.ts, before any other imports, per
// the @sentry/nestjs setup requirements. This module just wires up the
// Nest-level interceptors/filters on top of that.
@Module({
  imports: [SentryNestModule.forRoot()],
  exports: [SentryNestModule],
})
export class SentryConfigModule {}