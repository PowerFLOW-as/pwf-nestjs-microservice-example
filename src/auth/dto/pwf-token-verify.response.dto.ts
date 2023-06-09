import { IsBoolean, IsObject } from 'class-validator';

import type { User } from '../../shared/models/user';

export class PwfTokenVerifyResponseDto {
  @IsBoolean()
  readonly valid: boolean;

  @IsObject()
  readonly user: User;
}
