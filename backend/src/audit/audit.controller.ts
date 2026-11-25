import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, Tenant } from '../common/decorators/tenant.decorator';
import { AuditService } from './audit.service';

@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller('audit')
export class AuditController {
  constructor(private svc: AuditService) {}
  @Roles('OWNER', 'ADMIN') @Get() list(@Tenant() org: string, @Query('take') take?: string) { return this.svc.list(org, take ? Number(take) : 100); }
}
