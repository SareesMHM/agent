import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

/** Strips client-supplied organizationId from bodies so it can never override the verified tenant. */
@Injectable()
export class TenantScopeInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler) {
    const req = ctx.switchToHttp().getRequest();
    if (req.body && typeof req.body === 'object') delete req.body.organizationId;
    return next.handle();
  }
}
