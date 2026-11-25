import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  profile(id: string) {
    return this.prisma.user.findUnique({ where: { id }, select: { id: true, email: true, name: true, emailVerified: true, createdAt: true } });
  }
  update(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({ where: { id }, data: { name: dto.name }, select: { id: true, email: true, name: true } });
  }
}
