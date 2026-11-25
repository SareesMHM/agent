import { Module } from '@nestjs/common';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';
import { AgentConfigService } from './agent-config.service';

@Module({ controllers: [AgentsController], providers: [AgentsService, AgentConfigService], exports: [AgentsService, AgentConfigService] })
export class AgentsModule {}
