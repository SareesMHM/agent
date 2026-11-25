import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}
  @Post('register') register(@Body() dto: RegisterDto) { return this.auth.register(dto); }
  @Post('login') login(@Body() dto: LoginDto) { return this.auth.login(dto); }
  @Post('verify-email') verify(@Body('token') token: string) { return this.auth.verifyEmail(token); }
  @Post('forgot-password') forgot(@Body('email') email: string) { return this.auth.requestPasswordReset(email); }
  @UseGuards(JwtAuthGuard) @Get('me') me(@CurrentUser() u: any) { return u; }
}
