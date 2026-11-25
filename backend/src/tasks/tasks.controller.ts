import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, Tenant } from '../common/decorators/tenant.decorator';
import { TasksService } from './tasks.service';

@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller('tasks')
export class TasksController {
  constructor(private svc: TasksService) {}
  @Get() list(@Tenant() org: string, @Query('projectId') pid: string) { return this.svc.listForProject(org, pid); }
  @Get('messages') messages(@Tenant() org: string, @Query('projectId') pid: string) { return this.svc.messages(org, pid); }
  @Get(':id') get(@Tenant() org: string, @Param('id') id: string) { return this.svc.findOne(org, id); }
  @Roles('OWNER', 'ADMIN', 'MEMBER') @Post() create(@Tenant() org: string, @Body() b: any) { return this.svc.create(org, b); }
  @Roles('OWNER', 'ADMIN', 'MEMBER') @Patch(':id') update(@Tenant() org: string, @Param('id') id: string, @Body() b: any) { return this.svc.update(org, id, b); }
  @Roles('OWNER', 'ADMIN') @Delete(':id') remove(@Tenant() org: string, @Param('id') id: string) { return this.svc.remove(org, id); }
  @Roles('OWNER', 'ADMIN', 'MEMBER') @Post(':id/execute') execute(@Tenant() org: string, @Param('id') id: string) { return this.svc.execute(org, id); }
}
