import { BadRequestException, Injectable } from '@nestjs/common';
import { TenantCrudService } from '../common/base/tenant-crud.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApprovalsService extends TenantCrudService {
  protected model = 'approval';
  protected allowed: string[] = [];
  constructor(prisma: PrismaService) { super(prisma); }

  list(orgId: string, projectId?: string, status?: string) {
    return this.prisma.approval.findMany({
      where: { organizationId: orgId, ...(projectId ? { projectId } : {}), ...(status ? { status: status as any } : {}) },
      include: { task: { select: { id: true, title: true, output: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
  /** Approve -> task COMPLETED (unblocks dependents). Reject -> task back to PENDING for rework with feedback. */
  async decide(orgId: string, id: string, userId: string, approve: boolean, note?: string) {
    const a = await this.findOne(orgId, id);
    if (a.status !== 'PENDING') throw new BadRequestException('Already decided');
    const updated = await this.prisma.approval.update({
      where: { id },
      data: { status: approve ? 'APPROVED' : 'REJECTED', decidedById: userId, decidedAt: new Date(), payload: { ...(a.payload as object), note } },
    });
    if (a.taskId) {
      await this.prisma.task.update({
        where: { id: a.taskId },
        data: approve ? { status: 'COMPLETED' } : { status: 'PENDING', description: undefined },
      });
    }
    return updated;
  }
}
