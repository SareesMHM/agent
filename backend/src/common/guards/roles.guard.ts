import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(ctx: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [ctx.getHandler(), ctx.getClass()]);
    if (!roles?.length) return true;
    const req = ctx.switchToHttp().getRequest();
    if (!roles.includes(req.orgRole)) throw new ForbiddenException('Insufficient role');
    return true;
  }
}
