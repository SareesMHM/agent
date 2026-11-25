
import {
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';

import { Task } from '@prisma/client';

import { TenantCrudService } from '../common/base/tenant-crud.service';
import { PrismaService } from '../prisma/prisma.service';
import { AiClientService } from '../ai-client/ai-client.service';
import { AiEventsGateway } from '../ai-client/ai-events.gateway';
import { TaskSchedulerService } from './task-scheduler.service';

@Injectable()
export class TasksService extends TenantCrudService {
  private readonly logger = new Logger(TasksService.name);

  protected model = 'task';

  protected allowed = [
    'title',
    'description',
    'phase',
    'status',
    'priority',
    'estimatedHours',
    'assignedAgentId',
    'requiresApproval',
  ];

  constructor(
    prisma: PrismaService,
    private readonly ai: AiClientService,
    private readonly events: AiEventsGateway,
    private readonly scheduler: TaskSchedulerService,
  ) {
    super(prisma);
  }

  /**
   * Create a manual task.
   * The project must belong to the caller's organization.
   */
  async create(orgId: string, data: Record<string, any>) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: data.projectId,
        organizationId: orgId,
      },
    });

    if (!project) {
      throw new BadRequestException('Project not found');
    }

    const title = String(data.title ?? '').trim();

    if (!title) {
      throw new BadRequestException('Task title is required');
    }

    return this.prisma.task.create({
      data: {
        ...this.pick(data),
        title,
        description: String(data.description ?? ''),
        projectId: project.id,
        organizationId: orgId,
      },
    });
  }

  /**
   * Get all tasks belonging to a project.
   */
  listForProject(orgId: string, projectId: string) {
    return this.prisma.task.findMany({
      where: {
        organizationId: orgId,
        projectId,
      },
      include: {
        assignedAgent: {
          select: {
            id: true,
            name: true,
            roleName: true,
          },
        },
        dependencies: {
          select: {
            dependsOnId: true,
          },
        },
      },
      orderBy: [
        {
          createdAt: 'asc',
        },
      ],
    });
  }

  /**
   * Generate a project roadmap and tasks using AI.
   * Assign tasks to agents and create validated dependencies.
   */
  async plan(
    orgId: string,
    projectId: string,
    force = false,
  ) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        organizationId: orgId,
      },
      include: {
        agents: true,
      },
    });

    if (!project) {
      throw new BadRequestException('Project not found');
    }

    if (!project.agents.length) {
      throw new BadRequestException(
        'Approve roles (create agents) before planning tasks',
      );
    }

    const existing = await this.prisma.task.count({
      where: {
        projectId,
      },
    });

    if (existing && !force) {
      throw new BadRequestException(
        'Project already has tasks (pass force=true to replan)',
      );
    }

    const plan = await this.ai.planTasks({
      name: project.name,
      description: project.description,
      analysis: project.analysis,
      roles: project.agents.map((agent) => agent.roleName),
    });

    const items: any[] = plan.tasks ?? [];

    if (!items.length) {
      throw new BadRequestException('AI returned no tasks');
    }

    // Extract task dependencies.
    const deps = items.map((task) =>
      (task.dependsOn ?? []).filter((index: any) =>
        Number.isInteger(index),
      ),
    );

    // Prevent circular task dependencies.
    if (this.scheduler.hasCycle(deps)) {
      throw new BadRequestException(
        'AI produced cyclic dependencies; try again',
      );
    }

    // Find the Project Manager agent.
    const projectManager = project.agents.find((agent) =>
      /project manager/i.test(agent.roleName),
    );

    // Match AI-generated roles with existing agents.
    const findAgentByRole = (role: string) => {
      const normalizedRole = String(role).toLowerCase();

      return (
        project.agents.find(
          (agent) =>
            agent.roleName.toLowerCase() === normalizedRole,
        ) ??
        project.agents.find((agent) =>
          agent.roleName
            .toLowerCase()
            .includes(normalizedRole.split(' ')[0]),
        ) ??
        projectManager ??
        project.agents[0]
      );
    };

    return this.prisma.$transaction(async (tx) => {
      // Delete existing tasks when force replanning.
      if (existing) {
        await tx.task.deleteMany({
          where: {
            projectId,
          },
        });
      }

      // FIX: Explicitly type the created task array.
      const created: Task[] = [];

      // Create all AI-generated tasks.
      for (const task of items) {
        const agent = findAgentByRole(task.role ?? '');

        const newTask = await tx.task.create({
          data: {
            organizationId: orgId,
            projectId,
            title: String(task.title ?? 'Untitled Task').slice(
              0,
              200,
            ),
            description: String(task.description ?? ''),
            phase: task.phase ?? null,
            priority: Number(task.priority) || 3,
            estimatedHours: task.estimatedHours ?? null,
            requiresApproval: Boolean(task.requiresApproval),
            assignedAgentId: agent?.id ?? null,
          },
        });

        created.push(newTask);
      }

      // Create task dependency relationships.
      for (let i = 0; i < items.length; i++) {
        for (const j of deps[i]) {
          if (
            created[i] &&
            created[j] &&
            j !== i
          ) {
            await tx.taskDependency.create({
              data: {
                taskId: created[i].id,
                dependsOnId: created[j].id,
              },
            });
          }
        }
      }

      // Extract unique workflow phases.
      const phases = [
        ...new Set(
          items
            .map((task) => task.phase)
            .filter(Boolean),
        ),
      ] as string[];

      // Create the default project workflow.
      await tx.workflow.create({
        data: {
          organizationId: orgId,
          projectId,
          name: 'Default delivery pipeline',
          status: 'READY',
          definition: {
            mode: 'dependency-driven',
            parallel: true,
          },
          steps: {
            create: phases.map((name, order) => ({
              order,
              name,
              type: 'phase',
            })),
          },
        },
      });

      // Activate the project.
      await tx.project.update({
        where: {
          id: projectId,
        },
        data: {
          status: 'ACTIVE',
        },
      });

      return created;
    });
  }

  /**
   * Execute an individual task using its assigned AI agent.
   */
  async execute(orgId: string, taskId: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        organizationId: orgId,
      },
      include: {
        assignedAgent: {
          include: {
            tools: true,
          },
        },
        project: true,
        dependencies: {
          include: {
            dependsOn: true,
          },
        },
      },
    });

    if (!task) {
      throw new BadRequestException('Task not found');
    }

    if (!task.assignedAgent) {
      throw new BadRequestException(
        'Task has no assigned agent',
      );
    }

    if (
      task.dependencies.some(
        (dependency) =>
          dependency.dependsOn.status !== 'COMPLETED',
      )
    ) {
      throw new BadRequestException(
        'Dependencies not completed',
      );
    }

    if (!['PENDING', 'FAILED'].includes(task.status)) {
      throw new BadRequestException(
        `Task is ${task.status}`,
      );
    }

    const agent = task.assignedAgent;

    // Mark task and agent as running.
    await this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        status: 'IN_PROGRESS',
      },
    });

    await this.prisma.aiAgent.update({
      where: {
        id: agent.id,
      },
      data: {
        status: 'RUNNING',
      },
    });

    // Create execution record.
    const run = await this.prisma.agentRun.create({
      data: {
        agentId: agent.id,
        taskId,
        input: {
          title: task.title,
        },
      },
    });

    this.events.emit(orgId, {
      type: 'task.started',
      taskId,
      agentId: agent.id,
      projectId: task.projectId,
    });

    try {
      // Execute task through the AI service.
      const result = await this.ai.executeTask({
        organizationId: orgId,
        projectId: task.projectId,
        taskId,

        agent: {
          id: agent.id,
          name: agent.name,
          roleName: agent.roleName,
          systemPrompt: agent.systemPrompt,
          tools: agent.tools
            .filter((tool) => tool.permitted)
            .map((tool) => tool.toolName),
        },

        task: {
          title: task.title,
          description: task.description,
          phase: task.phase,
        },

        project: {
          name: task.project.name,
          description: task.project.description,
        },

        context: task.dependencies.map((dependency) => ({
          title: dependency.dependsOn.title,
          output: dependency.dependsOn.output,
        })),
      });

      const status = task.requiresApproval
        ? 'REVIEW'
        : 'COMPLETED';

      // Save task output.
      const updated = await this.prisma.task.update({
        where: {
          id: taskId,
        },
        data: {
          status,
          output: result,
        },
      });

      // Complete the execution record.
      await this.prisma.agentRun.update({
        where: {
          id: run.id,
        },
        data: {
          status: 'completed',
          output: result,
          tokens: result.tokens ?? 0,
          finishedAt: new Date(),
        },
      });

      // Save agent report.
      await this.prisma.agentMessage.create({
        data: {
          projectId: task.projectId,
          fromAgentId: agent.id,
          taskId,
          kind: 'report',
          content: `${agent.name} finished "${task.title}": ${result.summary ?? ''}`,
        },
      });

      // Create approval request when required.
      if (task.requiresApproval) {
        await this.prisma.approval.create({
          data: {
            organizationId: orgId,
            projectId: task.projectId,
            taskId,
            kind: 'task_output',
            payload: {
              title: task.title,
              summary: result.summary,
            },
          },
        });
      }

      // Notify connected clients.
      this.events.emit(orgId, {
        type: 'task.finished',
        taskId,
        status,
        agentId: agent.id,
        projectId: task.projectId,
      });

      return updated;
    } catch (error) {
      const message = (error as Error).message;

      this.logger.warn(
        `Task ${taskId} failed: ${message}`,
      );

      // Mark task as failed.
      await this.prisma.task.update({
        where: {
          id: taskId,
        },
        data: {
          status: 'FAILED',
          output: {
            error: message,
          },
        },
      });

      // Update execution record.
      await this.prisma.agentRun.update({
        where: {
          id: run.id,
        },
        data: {
          status: 'failed',
          error: message,
          finishedAt: new Date(),
        },
      });

      // Save error message.
      await this.prisma.agentMessage.create({
        data: {
          projectId: task.projectId,
          fromAgentId: agent.id,
          taskId,
          kind: 'error',
          content: `Task "${task.title}" failed: ${message}`,
        },
      });

      this.events.emit(orgId, {
        type: 'task.failed',
        taskId,
        error: message,
        projectId: task.projectId,
      });

      return this.prisma.task.findUnique({
        where: {
          id: taskId,
        },
      });
    } finally {
      // Reset agent status after execution.
      await this.prisma.aiAgent.update({
        where: {
          id: agent.id,
        },
        data: {
          status: 'IDLE',
        },
      });
    }
  }

  /**
   * Run all runnable tasks using dependency-driven execution.
   * Maximum three tasks execute concurrently in each wave.
   */
  async runAll(orgId: string, projectId: string) {
    let executed = 0;

    for (let guard = 0; guard < 100; guard++) {
      const ready = (
        await this.scheduler.runnable(orgId, projectId)
      ).slice(0, 3);

      if (!ready.length) {
        break;
      }

      await Promise.all(
        ready.map((task) =>
          this.execute(orgId, task.id),
        ),
      );

      executed += ready.length;
    }

    const remaining = await this.prisma.task.groupBy({
      by: ['status'],
      where: {
        projectId,
      },
      _count: true,
    });

    if (
      !remaining.some(
        (record) => record.status !== 'COMPLETED',
      )
    ) {
      await this.prisma.project.update({
        where: {
          id: projectId,
        },
        data: {
          status: 'COMPLETED',
        },
      });
    }

    return {
      executed,
      summary: remaining.map((record) => ({
        status: record.status,
        count: record._count,
      })),
    };
  }

  /**
   * Get recent project messages.
   */
  messages(orgId: string, projectId: string) {
    return this.prisma.agentMessage.findMany({
      where: {
        projectId,
        project: {
          organizationId: orgId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });
  }
}
