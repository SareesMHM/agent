import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, Tenant } from '../common/decorators/tenant.decorator';
import { DocumentsService } from './documents.service';

@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private svc: DocumentsService) {}
  @Get() list(@Tenant() org: string, @Query('projectId') pid: string) { return this.svc.listForProject(org, pid); }
  @Get(':id') get(@Tenant() org: string, @Param('id') id: string) { return this.svc.findOne(org, id); }
  @Roles('OWNER', 'ADMIN', 'MEMBER') @Post('generate') generate(@Tenant() org: string, @Body() b: { projectId: string; type: string }) { return this.svc.generate(org, b.projectId, b.type); }
  @Roles('OWNER', 'ADMIN') @Delete(':id') remove(@Tenant() org: string, @Param('id') id: string) { return this.svc.remove(org, id); }
}
