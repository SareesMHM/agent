import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

/** Injects the verified organization id (set by TenantGuard). */
export const Tenant = createParamDecorator((_d, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().organizationId as string);

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
