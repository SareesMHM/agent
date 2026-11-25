import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles, Tenant } from '../common/decorators/tenant.decorator';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';

@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private svc: ProjectsService) {}
  @Get() list(@Tenant() org: string) { return this.svc.findAll(org); }
  @Get('overview') overview(@Tenant() org: string) { return this.svc.overview(org); }
  @Roles('OWNER', 'ADMIN', 'MEMBER') @Post() create(@Tenant() org: string, @CurrentUser() u: any, @Body() dto: CreateProjectDto) { return this.svc.createAndAnalyze(org, u.id, dto); }
  @Get(':id') get(@Tenant() org: string, @Param('id') id: string) { return this.svc.findOne(org, id); }
  @Get(':id/stats') stats(@Tenant() org: string, @Param('id') id: string) { return this.svc.stats(org, id); }
  @Roles('OWNER', 'ADMIN', 'MEMBER') @Patch(':id') update(@Tenant() org: string, @Param('id') id: string, @Body() b: any) { return this.svc.update(org, id, b); }
  @Roles('OWNER', 'ADMIN') @Delete(':id') remove(@Tenant() org: string, @Param('id') id: string) { return this.svc.remove(org, id); }
  @Roles('OWNER', 'ADMIN', 'MEMBER') @Post(':id/generate-roles') roles(@Tenant() org: string, @Param('id') id: string) { return this.svc.generateRoles(org, id); }
  @Roles('OWNER', 'ADMIN', 'MEMBER') @Post(':id/approve-roles') approve(@Tenant() org: string, @Param('id') id: string, @Body('roles') roles?: any[]) { return this.svc.approveRoles(org, id, roles); }
  @Roles('OWNER', 'ADMIN', 'MEMBER') @Post(':id/plan') plan(@Tenant() org: string, @Param('id') id: string, @Query('force') force?: string) { return this.svc.plan(org, id, force === 'true'); }
  @Roles('OWNER', 'ADMIN', 'MEMBER') @Post(':id/run') run(@Tenant() org: string, @Param('id') id: string) { return this.svc.run(org, id); }
}
