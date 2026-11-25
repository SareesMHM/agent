import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TasksService } from '../../tasks/tasks.service';

/**
 * Executes a workflow. Current engine: dependency-driven waves (sequential across dependencies,
 * parallel within a wave) with human approval checkpoints (REVIEW tasks block dependents)
 * and retry of FAILED tasks. TODO: conditional branches & BullMQ background execution.
 */
@Injectable()
export class WorkflowRunnerService {
  constructor(private prisma: PrismaService, private tasks: TasksService) {}

  async run(orgId: string, workflowId: string, retryFailed = true) {
    const wf = await this.prisma.workflow.findFirst({ where: { id: workflowId, organizationId: orgId } });
    if (!wf) throw new Error('Workflow not found');
    await this.prisma.workflow.update({ where: { id: wf.id }, data: { status: 'RUNNING' } });
    if (retryFailed) await this.prisma.task.updateMany({ where: { projectId: wf.projectId, status: 'FAILED' }, data: { status: 'PENDING' } });
    const result = await this.tasks.runAll(orgId, wf.projectId);
    const waiting = result.summary.some((s) => s.status === 'REVIEW');
    await this.prisma.workflow.update({ where: { id: wf.id }, data: { status: waiting ? 'WAITING_APPROVAL' : 'COMPLETED' } });
    return result;
  }
}
