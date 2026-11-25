import { Module } from '@nestjs/common';
import { TasksModule } from '../tasks/tasks.module';
import { WorkflowsController } from './workflows.controller';
import { WorkflowsService } from './workflows.service';
import { WorkflowRunnerService } from './engine/workflow-runner.service';

@Module({ imports: [TasksModule], controllers: [WorkflowsController], providers: [WorkflowsService, WorkflowRunnerService], exports: [WorkflowsService] })
export class WorkflowsModule {}
