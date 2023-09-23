import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CappadociaViewerClient } from './cappadocia-viewer-client';
import { ViewerType } from './viewer-type.enum';
import { Request } from 'express';

@Injectable()
export class CappadociaViewerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const startTime = Date.now();
    const statusCode = httpContext.getResponse().statusCode;
    const { method, url, query, body } = request;

    return next.handle().pipe(
      tap(response => {
        const duration = Date.now() - startTime;
        CappadociaViewerClient.send({
          type: ViewerType.REQUEST,
          message: url,
          badge: method,
          context: {
            status: [String(statusCode)],
            query: query,
            body: body,
            response: response,
            headers: {
              data: request.headers,
            },
            duration: `${duration} ms`,
            ip: request.ip,
            memory: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
              1,
            )} MB`,
            method: method,
          },
        });
      }),
    );
  }
}
