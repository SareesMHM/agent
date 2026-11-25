import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles, Tenant } from '../common/decorators/tenant.decorator';
import { ApprovalsService } from './approvals.service';

@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller('approvals')
export class ApprovalsController {
  constructor(private svc: ApprovalsService) {}
  @Get() list(@Tenant() org: string, @Query('projectId') pid?: string, @Query('status') status?: string) { return this.svc.list(org, pid, status); }
  @Roles('OWNER', 'ADMIN') @Post(':id/approve') approve(@Tenant() org: string, @CurrentUser() u: any, @Param('id') id: string, @Body('note') note?: string) { return this.svc.decide(org, id, u.id, true, note); }
  @Roles('OWNER', 'ADMIN') @Post(':id/reject') reject(@Tenant() org: string, @CurrentUser() u: any, @Param('id') id: string, @Body('note') note?: string) { return this.svc.decide(org, id, u.id, false, note); }
}
