import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  private sign(u: { id: string; email: string; name: string }) {
    return { token: this.jwt.sign({ sub: u.id }), user: { id: u.id, email: u.email, name: u.name } };
  }
  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase();
    if (await this.prisma.user.findUnique({ where: { email } })) throw new ConflictException('Email already registered');
    const user = await this.prisma.user.create({
      data: { email, name: dto.name, passwordHash: await bcrypt.hash(dto.password, 10) },
    });
    // TODO: send verification email (SMTP/SES). Logged for development.
    this.logger.log(`Verification requested for ${email}`);
    return this.sign(user);
  }
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) throw new UnauthorizedException('Invalid credentials');
    return this.sign(user);
  }
  async verifyEmail(token: string) {
    // TODO: validate signed token. Development shortcut: token is the user id.
    await this.prisma.user.update({ where: { id: token }, data: { emailVerified: true } }).catch(() => undefined);
    return { ok: true };
  }
  async requestPasswordReset(email: string) {
    // TODO: email a signed, expiring reset link. Always respond ok to avoid user enumeration.
    this.logger.log(`Password reset requested for ${email}`);
    return { ok: true };
  }
}
