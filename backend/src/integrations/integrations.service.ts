import { Injectable } from '@nestjs/common';
import { TenantCrudService } from '../common/base/tenant-crud.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IntegrationsService extends TenantCrudService {
  protected model = 'integration';
  protected allowed = ['provider', 'enabled', 'config'];
  constructor(prisma: PrismaService) { super(prisma); }
}
