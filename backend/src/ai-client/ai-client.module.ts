import { Global, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AiClientService } from './ai-client.service';
import { AiEventsGateway } from './ai-events.gateway';
import { AiEventsController } from './ai-events.controller';

@Global()
@Module({
  imports: [AuthModule],
  controllers: [AiEventsController],
  providers: [AiClientService, AiEventsGateway],
  exports: [AiClientService, AiEventsGateway],
})
export class AiClientModule {}
