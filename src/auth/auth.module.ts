import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as services from './services';
import { PwfServiceAuthStrategy } from './strategies';

@Module({
  imports: [HttpModule],
  providers: [services.AuthService, ConfigService, PwfServiceAuthStrategy],
  exports: [services.AuthService],
})
export class AuthModule {}
