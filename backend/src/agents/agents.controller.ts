import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, Tenant } from '../common/decorators/tenant.decorator';
import { AgentsService } from './agents.service';

@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller('agents')
export class AgentsController {
  constructor(private svc: AgentsService) {}
  @Get() list(@Tenant() org: string, @Query('projectId') projectId: string) { return this.svc.listForProject(org, projectId); }
  @Get(':id') get(@Tenant() org: string, @Param('id') id: string) { return this.svc.detail(org, id); }
  @Roles('OWNER', 'ADMIN') @Patch(':id') update(@Tenant() org: string, @Param('id') id: string, @Body() b: any) { return this.svc.update(org, id, b); }
  @Roles('OWNER', 'ADMIN') @Patch(':id/tools/:tool') tool(@Tenant() org: string, @Param('id') id: string, @Param('tool') tool: string, @Body('permitted') p: boolean) { return this.svc.setToolPermission(org, id, tool, !!p); }
  @Roles('OWNER', 'ADMIN') @Delete(':id') remove(@Tenant() org: string, @Param('id') id: string) { return this.svc.remove(org, id); }
}
