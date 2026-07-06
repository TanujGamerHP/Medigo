import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseFormat<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  requestId: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseFormat<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseFormat<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    return next.handle().pipe(
      map((data) => {
        // If the return object is already formatted, bypass
        if (data && typeof data === 'object' && 'success' in data && 'requestId' in data) {
          return data;
        }

        const message = data?.message || 'Request processed successfully';
        const innerData = data?.data !== undefined ? data.data : data;

        return {
          success: true,
          message,
          data: innerData === null ? {} : innerData,
          timestamp: new Date().toISOString(),
          requestId: request.headers['x-request-id'] || `req-${Math.random().toString(36).substring(2, 9)}`,
        };
      }),
    );
  }
}
