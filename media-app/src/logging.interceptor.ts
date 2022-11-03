import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadGatewayException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Media Before...');

    const now = Date.now();
    return next.handle().pipe(
      tap(() => console.log(`Media After... ${Date.now() - now}ms`)),
      catchError((err) => throwError(() => new BadGatewayException())),
    );
  }
}
