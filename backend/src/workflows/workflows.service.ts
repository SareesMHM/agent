import { Injectable } from '@nestjs/common';
import { TenantCrudService } from '../common/base/tenant-crud.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkflowsService extends TenantCrudService {
  protected model = 'workflow';
  protected allowed = ['name', 'status', 'definition'];
  constructor(prisma: PrismaService) { super(prisma); }
  listForProject(orgId: string, projectId: string) {
    return this.prisma.workflow.findMany({ where: { organizationId: orgId, projectId }, include: { steps: { orderBy: { order: 'asc' } } }, orderBy: { createdAt: 'desc' } });
  }
}
