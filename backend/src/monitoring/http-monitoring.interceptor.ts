import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MonitoringService } from './monitoring.service';
import { Request, Response } from 'express';

@Injectable()
export class HttpMonitoringInterceptor implements NestInterceptor {
  constructor(private readonly monitoringService: MonitoringService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();
    
    const startTime = Date.now();
    const { method, path } = request;
    
    return next.handle().pipe(
      tap(() => {
        const durationMs = Date.now() - startTime;
        const statusCode = response.statusCode;
        
        this.monitoringService.trackHttpRequest(method, path, statusCode, durationMs);
      }),
    );
  }
}