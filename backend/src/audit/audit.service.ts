import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}
  list(orgId: string, take = 100) {
    return this.prisma.auditLog.findMany({ where: { organizationId: orgId }, orderBy: { createdAt: 'desc' }, take: Math.min(take, 500) });
  }
}
