import { Injectable } from '@nestjs/common';
import { Counter, Gauge, Histogram, Registry } from 'prom-client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class MonitoringService {
  constructor(
    @InjectMetric('urban_http_requests_total')
    private readonly httpRequestsTotal: Counter<string>,
    
    @InjectMetric('urban_http_request_duration_seconds')
    private readonly httpRequestDuration: Histogram<string>,
    
    @InjectMetric('urban_active_users')
    private readonly activeUsers: Gauge<string>,
    
    @InjectMetric('urban_database_connections')
    private readonly databaseConnections: Gauge<string>,
  ) {}

  trackHttpRequest(method: string, path: string, statusCode: number, durationMs: number) {
    this.httpRequestsTotal.labels(method, path, statusCode.toString()).inc();
    this.httpRequestDuration.labels(method, path).observe(durationMs / 1000);
  }

  setActiveUsers(count: number) {
    this.activeUsers.set(count);
  }

  setDatabaseConnections(count: number) {
    this.databaseConnections.set(count);
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async collectSystemMetrics() {
    // In a real implementation, you would collect system metrics here
    // For example: CPU usage, memory usage, etc.
  }
}