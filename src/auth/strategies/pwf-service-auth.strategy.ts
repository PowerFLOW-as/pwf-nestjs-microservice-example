import { ForbiddenException, HttpException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { Strategy } from 'passport-custom';

import type { User } from '../../shared/models/user';
import { AuthService } from '../services/auth.service';

@Injectable()
export class PwfServiceAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(request: Request): Promise<User | void> {
    const userData: User | void = await this.authService.verifyToken(request).catch((err: any) => {
      if (err.isAxiosError) {
        const responseStatus = err.response.status;
        if (responseStatus === 401) {
          Logger.log(`User unauthenticated: ${err.response.data}`);
          throw new UnauthorizedException();
        }
        if (responseStatus === 403) {
          Logger.log(`User unauthorized: ${err.response.data}`);
          throw new ForbiddenException();
        }
        Logger.error(`User unable to verify in PWF Service: ${JSON.stringify(err)}`);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        throw new HttpException(err.response.data, err.response.status);
      } else {
        Logger.error(`User unable to verify - internal error: ${JSON.stringify(err)}`);
        throw new InternalServerErrorException(JSON.stringify(err));
      }
    });

    if (userData?.uid) {
      Logger.debug(`User verified successfully, user's id: ${userData.uid}`);
      return userData;
    } else {
      Logger.log(`User unauthenticated (was not found)`);
      throw new UnauthorizedException();
    }
  }
}
