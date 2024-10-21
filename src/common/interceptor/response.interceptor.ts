import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

/**
 * @description response格式统一化
 * @export
 * @class ResponseInterceptor
 * @implements {NestInterceptor}
 */
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return {
          code: 0,
          data,
          message: 'success',
        };
      }),
    );
  }
}
