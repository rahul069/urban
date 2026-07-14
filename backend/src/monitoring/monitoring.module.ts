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
    }),
  ],
  providers: [
    MonitoringService,
    makeCounterProvider({
      name: 'urban_http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'path', 'status_code'],
    }),
    makeHistogramProvider({
      name: 'urban_http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'path'],
    }),
    makeGaugeProvider({
      name: 'urban_active_users',
      help: 'Number of currently active users',
    }),
    makeGaugeProvider({
      name: 'urban_database_connections',
      help: 'Number of active database connections',
    }),
  ],
  exports: [MonitoringService],
})
export class MonitoringModule {}