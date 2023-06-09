import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class PwfServiceAuthGuard extends AuthGuard('custom') implements CanActivate {
  public override async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = <boolean>await super.canActivate(context);
    return result;
  }
}
