import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, Tenant } from '../common/decorators/tenant.decorator';
import { DepartmentsService } from './departments.service';

@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller('departments')
export class DepartmentsController {
  constructor(private svc: DepartmentsService) {}
  @Get() list(@Tenant() org: string) { return this.svc.findAll(org); }
  @Get(':id') get(@Tenant() org: string, @Param('id') id: string) { return this.svc.findOne(org, id); }
  @Roles('OWNER', 'ADMIN') @Post() create(@Tenant() org: string, @Body() b: any) { return this.svc.create(org, b); }
  @Roles('OWNER', 'ADMIN') @Patch(':id') update(@Tenant() org: string, @Param('id') id: string, @Body() b: any) { return this.svc.update(org, id, b); }
  @Roles('OWNER', 'ADMIN') @Delete(':id') remove(@Tenant() org: string, @Param('id') id: string) { return this.svc.remove(org, id); }
}
