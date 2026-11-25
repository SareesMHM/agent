import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}
  @Get('me') me(@CurrentUser() u: any) { return this.users.profile(u.id); }
  @Patch('me') update(@CurrentUser() u: any, @Body() dto: UpdateUserDto) { return this.users.update(u.id, dto); }
}
