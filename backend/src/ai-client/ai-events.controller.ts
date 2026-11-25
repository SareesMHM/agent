import { Body, Controller, ForbiddenException, Headers, Post } from '@nestjs/common';
import { AiEventsGateway } from './ai-events.gateway';

/** Internal endpoint: the AI service streams progress here (protected by INTERNAL_TOKEN). */
@Controller('internal/ai-events')
export class AiEventsController {
  constructor(private gw: AiEventsGateway) {}
  @Post()
  push(@Headers('x-internal-token') t: string, @Body() b: { organizationId: string; [k: string]: any }) {
    if (!process.env.INTERNAL_TOKEN || t !== process.env.INTERNAL_TOKEN) throw new ForbiddenException();
    this.gw.emit(b.organizationId, b);
    return { ok: true };
  }
}
