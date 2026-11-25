import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/** Resolves task dependencies: a task is runnable when it is PENDING and all dependencies are COMPLETED. */
@Injectable()
export class TaskSchedulerService {
  constructor(private prisma: PrismaService) {}

  async runnable(orgId: string, projectId: string) {
    const tasks = await this.prisma.task.findMany({
      where: { organizationId: orgId, projectId, status: 'PENDING' },
      include: { dependencies: { include: { dependsOn: { select: { status: true } } } } },
      orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }],
    });
    return tasks.filter((t) => t.dependencies.every((d) => d.dependsOn.status === 'COMPLETED'));
  }
  /** Detects cycles in a dependency list (indexes) before persisting a plan. */
  hasCycle(deps: number[][]): boolean {
    const state: number[] = new Array(deps.length).fill(0);
    const visit = (i: number): boolean => {
      if (state[i] === 1) return true;
      if (state[i] === 2) return false;
      state[i] = 1;
      for (const j of deps[i] ?? []) if (j >= 0 && j < deps.length && visit(j)) return true;
      state[i] = 2;
      return false;
    };
    return deps.some((_, i) => visit(i));
  }
}
