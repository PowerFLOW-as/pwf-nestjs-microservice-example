import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UnauthorizedException } from '@nestjs/common';
import type { Observable } from 'rxjs';

import type { BdsRequest } from '../../shared/models/request/request.interface';

@Injectable()
export class AuthTokenInterceptor implements NestInterceptor {
  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: BdsRequest = context.switchToHttp().getRequest();
    if (request.headers.authorization) {
      const bearerToken: string = request.headers.authorization.substring(request.headers.authorization.indexOf('Bearer ') + 7);
      request.headers['x-jwt-token'] = bearerToken;
    } else {
      throw new UnauthorizedException('Missing authorization header');
    }
    return next.handle();
  }
}
