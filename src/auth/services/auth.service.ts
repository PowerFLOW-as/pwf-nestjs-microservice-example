import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AxiosResponse } from 'axios';
import type { Request } from 'express';
import { firstValueFrom, map } from 'rxjs';

import type { User } from '../../shared/models/user';
import type { PwfTokenVerifyResponseDto } from '../dto/pwf-token-verify.response.dto';

@Injectable()
export class AuthService {
  constructor(private config: ConfigService, private httpService: HttpService) {}

  public async verifyToken(request: Request): Promise<User> {
    const token: any = request.headers.authorization ? request.headers.authorization : '';
    return firstValueFrom(
      this.httpService
        .get(`${this.config.get('pwf.service.uri')}/api/client/rest/token/verify`, {
          headers: {
            Authorization: token,
          },
        })
        .pipe(
          map((response: AxiosResponse<PwfTokenVerifyResponseDto>) => response.data),
          map((data: PwfTokenVerifyResponseDto) => data.user),
        ),
    );
  }
}
