import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrometheusModule, makeCounterProvider, makeGaugeProvider, makeHistogramProvider } from '@willsoto/nestjs-prometheus';
import { MonitoringService } from './monitoring.service';

@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: {
        enabled: process.env.NODE_ENV === 'production',
        config: {
          prefix: 'urban_',
        },
      },
      controller: {
        path: '/metrics',
      },
    }),
  ],
  providers: [MonitoringService],
  exports: [MonitoringService],
})
export class MonitoringModule {}