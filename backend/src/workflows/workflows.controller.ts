import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, Tenant } from '../common/decorators/tenant.decorator';
import { WorkflowsService } from './workflows.service';
import { WorkflowRunnerService } from './engine/workflow-runner.service';

@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller('workflows')
export class WorkflowsController {
  constructor(private svc: WorkflowsService, private runner: WorkflowRunnerService) {}
  @Get() list(@Tenant() org: string, @Query('projectId') pid: string) { return this.svc.listForProject(org, pid); }
  @Get(':id') get(@Tenant() org: string, @Param('id') id: string) { return this.svc.findOne(org, id); }
  @Roles('OWNER', 'ADMIN') @Patch(':id') update(@Tenant() org: string, @Param('id') id: string, @Body() b: any) { return this.svc.update(org, id, b); }
  @Roles('OWNER', 'ADMIN') @Delete(':id') remove(@Tenant() org: string, @Param('id') id: string) { return this.svc.remove(org, id); }
  @Roles('OWNER', 'ADMIN', 'MEMBER') @Post(':id/run') run(@Tenant() org: string, @Param('id') id: string) { return this.runner.run(org, id); }
}
