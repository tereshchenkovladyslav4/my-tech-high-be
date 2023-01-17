import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadGatewayException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(() => {
        // TODO -  replace to logging tool
        // console.info(`Application After... ${Date.now() - now}ms`);
      }),
      catchError(() => throwError(() => new BadGatewayException())),
    );
  }
}
