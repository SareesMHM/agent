import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantCrudService } from '../common/base/tenant-crud.service';
import { PrismaService } from '../prisma/prisma.service';
import { AgentConfigService, GeneratedRole } from './agent-config.service';

@Injectable()
export class AgentsService extends TenantCrudService {
  protected model = 'aiAgent';
  protected allowed = ['name', 'description', 'systemPrompt', 'status', 'config', 'departmentId'];
  constructor(prisma: PrismaService, private cfg: AgentConfigService) { super(prisma); }

  listForProject(orgId: string, projectId: string) {
    return this.prisma.aiAgent.findMany({
      where: { organizationId: orgId, projectId },
      include: { skills: true, tools: true, department: true, _count: { select: { tasks: true, runs: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }
  async detail(orgId: string, id: string) {
    const a = await this.prisma.aiAgent.findFirst({
      where: { id, organizationId: orgId },
      include: { skills: true, tools: true, department: true, tasks: true, runs: { orderBy: { startedAt: 'desc' }, take: 20 } },
    });
    if (!a) throw new NotFoundException('agent not found');
    return a;
  }
  async createFromRole(orgId: string, project: { id: string; name: string; description: string }, role: GeneratedRole) {
    const dept = await this.prisma.department.upsert({
      where: { organizationId_name: { organizationId: orgId, name: role.department } },
      update: {}, create: { organizationId: orgId, name: role.department },
    });
    return this.prisma.aiAgent.create({
      data: {
        organizationId: orgId, projectId: project.id, departmentId: dept.id,
        name: `${role.name} AI`, roleName: role.name, description: role.description,
        systemPrompt: this.cfg.buildSystemPrompt(role, project),
        config: { memory: 'conversation_buffer', reportsTo: role.reportsTo ?? null },
        skills: { create: (role.skills ?? []).map((name) => ({ name })) },
        tools: { create: this.cfg.resolveTools(role.tools) },
      },
    });
  }
  async setToolPermission(orgId: string, agentId: string, toolName: string, permitted: boolean) {
    await this.findOne(orgId, agentId);
    return this.prisma.agentTool.upsert({
      where: { agentId_toolName: { agentId, toolName } },
      update: { permitted }, create: { agentId, toolName, permitted },
    });
  }
}
