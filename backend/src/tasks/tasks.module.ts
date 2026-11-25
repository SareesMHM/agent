import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskSchedulerService } from './task-scheduler.service';

@Module({ controllers: [TasksController], providers: [TasksService, TaskSchedulerService], exports: [TasksService, TaskSchedulerService] })
export class TasksModule {}
