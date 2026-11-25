import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';

/** Live agent/task updates. Clients emit `join` with { token, organizationId } and receive `agent-event`. */
@Injectable()
@WebSocketGateway({ cors: { origin: process.env.FRONTEND_URL ?? 'http://localhost:3000' } })
export class AiEventsGateway {
  @WebSocketServer() server: Server;
  constructor(private jwt: JwtService, private prisma: PrismaService) {}

  @SubscribeMessage('join')
  async join(@ConnectedSocket() sock: Socket, @MessageBody() b: { token: string; organizationId: string }) {
    try {
      const { sub } = this.jwt.verify(b.token);
      const m = await this.prisma.organizationMember.findUnique({
        where: { organizationId_userId: { organizationId: b.organizationId, userId: sub } },
      });
      if (!m) return { ok: false };
      sock.join(`org:${b.organizationId}`);
      return { ok: true };
    } catch {
      return { ok: false };
    }
  }
  emit(orgId: string, event: Record<string, any>) {
    this.server?.to(`org:${orgId}`).emit('agent-event', { ...event, at: new Date().toISOString() });
  }
}
