import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@UseGuards(JwtAuthGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private orgs: OrganizationsService) {}
  @Get() list(@CurrentUser() u: any) { return this.orgs.listMine(u.id); }
  @Post() create(@CurrentUser() u: any, @Body() dto: CreateOrganizationDto) { return this.orgs.create(u.id, dto); }
  @Get(':id') get(@CurrentUser() u: any, @Param('id') id: string) { return this.orgs.get(id, u.id); }
  @Patch(':id') update(@CurrentUser() u: any, @Param('id') id: string, @Body() b: any) { return this.orgs.update(id, u.id, b); }
  @Delete(':id') remove(@CurrentUser() u: any, @Param('id') id: string) { return this.orgs.remove(id, u.id); }
  @Get(':id/members') members(@CurrentUser() u: any, @Param('id') id: string) { return this.orgs.members(id, u.id); }
  @Post(':id/members') invite(@CurrentUser() u: any, @Param('id') id: string, @Body() b: { email: string; role?: string }) { return this.orgs.invite(id, u.id, b.email, b.role); }
  @Delete(':id/members/:memberId') removeMember(@CurrentUser() u: any, @Param('id') id: string, @Param('memberId') mid: string) { return this.orgs.removeMember(id, u.id, mid); }
}
