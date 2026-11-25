import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  private async requireRole(orgId: string, userId: string, roles: string[]) {
    const m = await this.prisma.organizationMember.findUnique({ where: { organizationId_userId: { organizationId: orgId, userId } } });
    if (!m) throw new NotFoundException('Organization not found');
    if (!roles.includes(m.role)) throw new ForbiddenException('Insufficient role');
    return m;
  }
  listMine(userId: string) {
    return this.prisma.organization.findMany({
      where: { members: { some: { userId } } },
      include: { _count: { select: { projects: true, members: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
  create(userId: string, dto: CreateOrganizationDto) {
    return this.prisma.organization.create({ data: { ...dto, members: { create: { userId, role: 'OWNER' } } } });
  }
  async get(orgId: string, userId: string) {
    await this.requireRole(orgId, userId, ['OWNER', 'ADMIN', 'MEMBER', 'VIEWER']);
    return this.prisma.organization.findUnique({ where: { id: orgId }, include: { departments: true, _count: { select: { projects: true, members: true } } } });
  }
  async update(orgId: string, userId: string, data: Partial<CreateOrganizationDto> & { settings?: any }) {
    await this.requireRole(orgId, userId, ['OWNER', 'ADMIN']);
    const { name, industry, description, objectives, settings } = data;
    return this.prisma.organization.update({ where: { id: orgId }, data: { name, industry, description, objectives, settings } });
  }
  async remove(orgId: string, userId: string) {
    await this.requireRole(orgId, userId, ['OWNER']);
    await this.prisma.organization.delete({ where: { id: orgId } });
    return { deleted: true };
  }
  async members(orgId: string, userId: string) {
    await this.requireRole(orgId, userId, ['OWNER', 'ADMIN', 'MEMBER', 'VIEWER']);
    return this.prisma.organizationMember.findMany({ where: { organizationId: orgId }, include: { user: { select: { id: true, name: true, email: true } } } });
  }
  async invite(orgId: string, userId: string, email: string, role: any = 'MEMBER') {
    await this.requireRole(orgId, userId, ['OWNER', 'ADMIN']);
    if (role === 'OWNER') throw new BadRequestException('Cannot invite as OWNER');
    const u = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!u) throw new NotFoundException('User must register first (email invitations: TODO)');
    return this.prisma.organizationMember.upsert({
      where: { organizationId_userId: { organizationId: orgId, userId: u.id } },
      update: { role }, create: { organizationId: orgId, userId: u.id, role },
    });
  }
  async removeMember(orgId: string, userId: string, memberId: string) {
    await this.requireRole(orgId, userId, ['OWNER', 'ADMIN']);
    const m = await this.prisma.organizationMember.findFirst({ where: { id: memberId, organizationId: orgId } });
    if (!m) throw new NotFoundException();
    if (m.role === 'OWNER') throw new BadRequestException('Cannot remove owner');
    await this.prisma.organizationMember.delete({ where: { id: memberId } });
    return { deleted: true };
  }
}
