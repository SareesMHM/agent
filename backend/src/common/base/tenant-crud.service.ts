import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/** Generic tenant-scoped CRUD. Every query is filtered by organizationId; writes are field-whitelisted. */
export abstract class TenantCrudService {
  protected abstract model: string;
  protected abstract allowed: string[];
  constructor(protected prisma: PrismaService) {}

  protected get db(): any { return (this.prisma as any)[this.model]; }

  protected pick(data: Record<string, any> = {}) {
    const out: Record<string, any> = {};
    for (const k of this.allowed) if (data[k] !== undefined) out[k] = data[k];
    return out;
  }
  findAll(orgId: string, where: Record<string, any> = {}) {
    return this.db.findMany({ where: { organizationId: orgId, ...where }, orderBy: { createdAt: 'desc' } });
  }
  async findOne(orgId: string, id: string) {
    const r = await this.db.findFirst({ where: { id, organizationId: orgId } });
    if (!r) throw new NotFoundException(`${this.model} not found`);
    return r;
  }
  create(orgId: string, data: Record<string, any>) {
    return this.db.create({ data: { ...this.pick(data), organizationId: orgId } });
  }
  async update(orgId: string, id: string, data: Record<string, any>) {
    await this.findOne(orgId, id);
    return this.db.update({ where: { id }, data: this.pick(data) });
  }
  async remove(orgId: string, id: string) {
    await this.findOne(orgId, id);
    await this.db.delete({ where: { id } });
    return { deleted: true };
  }
}
