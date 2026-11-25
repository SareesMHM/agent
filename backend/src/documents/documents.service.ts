import { BadRequestException, Injectable } from '@nestjs/common';
import { TenantCrudService } from '../common/base/tenant-crud.service';
import { PrismaService } from '../prisma/prisma.service';
import { AiClientService } from '../ai-client/ai-client.service';

export const DOC_TYPES = ['SRS', 'BRD', 'ARCHITECTURE', 'API_DOCS', 'DB_DESIGN', 'TEST_PLAN', 'REPORT', 'PROPOSAL', 'JOB_DESCRIPTIONS'];

@Injectable()
export class DocumentsService extends TenantCrudService {
  protected model = 'document';
  protected allowed = ['title', 'content'];
  constructor(prisma: PrismaService, private ai: AiClientService) { super(prisma); }

  listForProject(orgId: string, projectId: string) {
    return this.prisma.document.findMany({ where: { organizationId: orgId, projectId }, orderBy: { createdAt: 'desc' } });
  }
  async generate(orgId: string, projectId: string, type: string) {
    if (!DOC_TYPES.includes(type)) throw new BadRequestException(`type must be one of ${DOC_TYPES.join(', ')}`);
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, organizationId: orgId },
      include: { agents: { select: { roleName: true } }, tasks: { select: { title: true, status: true, phase: true } } },
    });
    if (!project) throw new BadRequestException('Project not found');
    const doc = await this.ai.generateDocument({
      type, name: project.name, description: project.description, analysis: project.analysis,
      roles: project.agents.map((a) => a.roleName), tasks: project.tasks,
    });
    return this.prisma.document.create({ data: { organizationId: orgId, projectId, type, title: doc.title, content: doc.content } });
  }
}
