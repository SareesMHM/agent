import { Injectable } from '@nestjs/common';
import { TenantCrudService } from '../common/base/tenant-crud.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DepartmentsService extends TenantCrudService {
  protected model = 'department';
  protected allowed = ['name', 'description'];
  constructor(prisma: PrismaService) { super(prisma); }
}
