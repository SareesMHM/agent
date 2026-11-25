import { Module } from '@nestjs/common';
import { AgentsModule } from '../agents/agents.module';
import { TasksModule } from '../tasks/tasks.module';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({ imports: [AgentsModule, TasksModule], controllers: [ProjectsController], providers: [ProjectsService], exports: [ProjectsService] })
export class ProjectsModule {}
