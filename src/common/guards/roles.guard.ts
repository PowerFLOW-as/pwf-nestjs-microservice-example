import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

import type { Role } from '../../shared/models/user';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(), // Method Roles
      context.getClass(), // Controller Roles
    ]);

    if (!roles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<Request>();
    if (!user) {
      return false;
    }

    return user.roles.some((role: Role) => roles.includes(role.title));
  }
}
