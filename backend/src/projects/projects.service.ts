
import {
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';

import { AiAgent } from '@prisma/client';

import { TenantCrudService } from '../common/base/tenant-crud.service';
import { PrismaService } from '../prisma/prisma.service';
import { AiClientService } from '../ai-client/ai-client.service';
import { AgentsService } from '../agents/agents.service';
import { GeneratedRole } from '../agents/agent-config.service';
import { TasksService } from '../tasks/tasks.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService extends TenantCrudService {
  private readonly logger = new Logger(ProjectsService.name);

  protected model = 'project';
  protected allowed = ['name', 'description', 'status'];

  constructor(
    prisma: PrismaService,
    private readonly ai: AiClientService,
    private readonly agents: AgentsService,
    private readonly tasks: TasksService,
  ) {
    super(prisma);
  }

  /**
   * Create a project and analyze its requirements using AI.
   */
  async createAndAnalyze(
    orgId: string,
    userId: string,
    dto: CreateProjectDto,
  ) {
    const project = await this.prisma.project.create({
      data: {
        organizationId: orgId,
        name: dto.name,
        description: dto.description,
        createdById: userId,
        status: 'ANALYZING',
        members: {
          create: {
            userId,
            role: 'OWNER',
          },
        },
      },
    });

    try {
      const analysis = await this.ai.analyzeProject({
        name: dto.name,
        description: dto.description,
      });

      return await this.prisma.project.update({
        where: { id: project.id },
        data: {
          analysis,
          status: 'DRAFT',
        },
      });
    } catch (error) {
      this.logger.warn(
        `Project analysis failed: ${(error as Error).message}`,
      );

      await this.prisma.project.update({
        where: { id: project.id },
        data: {
          status: 'DRAFT',
        },
      });

      throw error;
    }
  }

  /**
   * Generate AI roles for a project.
   */
  async generateRoles(orgId: string, projectId: string) {
    const project = await this.findOne(orgId, projectId);

    const result = await this.ai.generateRoles({
      name: project.name,
      description: project.description,
      analysis: project.analysis,
    });

    return this.prisma.project.update({
      where: { id: projectId },
      data: {
        roles: result.roles,
      },
    });
  }

  /**
   * Approve project roles and create AI agents.
   */
  async approveRoles(
    orgId: string,
    projectId: string,
    roles?: GeneratedRole[],
  ) {
    const project = await this.findOne(orgId, projectId);

    const finalRoles: GeneratedRole[] =
      roles ?? (project.roles as GeneratedRole[] | null) ?? [];

    if (finalRoles.length === 0) {
      throw new BadRequestException(
        'No roles to approve; generate roles first.',
      );
    }

    // Ensure that every project has a Project Manager.
    const hasProjectManager = finalRoles.some((role) =>
      /project manager/i.test(role.name),
    );

    if (!hasProjectManager) {
      finalRoles.unshift({
        name: 'Project Manager',
        department: 'Management',
        description: 'Plans, assigns and reviews all work.',
        responsibilities: [
          'Create roadmap',
          'Assign tasks',
          'Review deliverables',
        ],
        skills: [
          'Planning',
          'Coordination',
        ],
        tools: [
          'doc_reader',
          'file_writer',
        ],
      });
    }

    // Delete previously generated agents for this project.
    await this.prisma.aiAgent.deleteMany({
      where: {
        projectId,
        organizationId: orgId,
      },
    });

    // Create agents using the approved roles.
    const created: AiAgent[] = [];

    for (const role of finalRoles) {
      const agent = await this.agents.createFromRole(
        orgId,
        project,
        role,
      );

      created.push(agent);
    }

    // Update project roles and status.
    await this.prisma.project.update({
      where: { id: projectId },
      data: {
        roles: finalRoles as any,
        status: 'READY',
      },
    });

    return created;
  }

  /**
   * Generate tasks for a project.
   */
  async plan(
    orgId: string,
    projectId: string,
    force: boolean,
  ) {
    return this.tasks.plan(orgId, projectId, force);
  }

  /**
   * Execute all runnable project tasks.
   */
  async run(orgId: string, projectId: string) {
    return this.tasks.runAll(orgId, projectId);
  }

  /**
   * Get project statistics.
   */
  async stats(orgId: string, projectId: string) {
    const [
      tasks,
      agents,
      runs,
      approvals,
    ] = await Promise.all([
      this.prisma.task.groupBy({
        by: ['status'],
        where: {
          organizationId: orgId,
          projectId,
        },
        _count: true,
      }),

      this.prisma.aiAgent.count({
        where: {
          organizationId: orgId,
          projectId,
        },
      }),

      this.prisma.agentRun.aggregate({
        where: {
          task: { projectId },
        },
        _count: true,
        _sum: {
          tokens: true,
        },
      }),

      this.prisma.approval.count({
        where: {
          organizationId: orgId,
          projectId,
          status: 'PENDING',
        },
      }),
    ]);

    const byStatus = Object.fromEntries(
      tasks.map((task) => [
        task.status,
        task._count,
      ]),
    );

    const totalTasks = tasks.reduce(
      (total, task) => total + task._count,
      0,
    );

    return {
      total: totalTasks,
      byStatus,
      agents,
      runs: runs._count,
      tokens: runs._sum.tokens ?? 0,
      pendingApprovals: approvals,
      progress: totalTasks
        ? Math.round(
            ((byStatus.COMPLETED ?? 0) / totalTasks) * 100,
          )
        : 0,
    };
  }

  /**
   * Get organization dashboard overview.
   */
  async overview(orgId: string) {
    const [
      companies,
      projects,
      agents,
      tasks,
    ] = await Promise.all([
      this.prisma.organization.count({
        where: { id: orgId },
      }),

      this.prisma.project.count({
        where: {
          organizationId: orgId,
          status: {
            in: [
              'READY',
              'ACTIVE',
              'ANALYZING',
              'DRAFT',
            ],
          },
        },
      }),

      this.prisma.aiAgent.count({
        where: {
          organizationId: orgId,
        },
      }),

      this.prisma.task.groupBy({
        by: ['status'],
        where: {
          organizationId: orgId,
        },
        _count: true,
      }),
    ]);

    const getTaskCount = (status: string) =>
      tasks.find((task) => task.status === status)?._count ?? 0;

    const recentMessages =
      await this.prisma.agentMessage.findMany({
        where: {
          project: {
            organizationId: orgId,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 8,
      });

    return {
      companies,
      activeProjects: projects,
      agents,
      pendingTasks:
        getTaskCount('PENDING') +
        getTaskCount('IN_PROGRESS') +
        getTaskCount('REVIEW'),
      completedTasks: getTaskCount('COMPLETED'),
      failedTasks: getTaskCount('FAILED'),
      recentMessages,
    };
  }
}
