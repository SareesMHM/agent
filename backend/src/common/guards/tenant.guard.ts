import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/** Verifies the user belongs to the organization named in x-organization-id (tenant isolation). */
@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}
  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const orgId = req.headers['x-organization-id'];
    if (!orgId || typeof orgId !== 'string') throw new BadRequestException('x-organization-id header required');
    const m = await this.prisma.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: orgId, userId: req.user.id } },
    });
    if (!m) throw new ForbiddenException('Not a member of this organization');
    req.organizationId = orgId;
    req.orgRole = m.role;
    return true;
  }
}
