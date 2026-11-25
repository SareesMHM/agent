import { Controller, Get, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { DepartmentsModule } from './departments/departments.module';
import { ProjectsModule } from './projects/projects.module';
import { AgentsModule } from './agents/agents.module';
import { TasksModule } from './tasks/tasks.module';
import { WorkflowsModule } from './workflows/workflows.module';
import { DocumentsModule } from './documents/documents.module';
import { ApprovalsModule } from './approvals/approvals.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { AuditModule } from './audit/audit.module';
import { AiClientModule } from './ai-client/ai-client.module';
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor';
import { PrismaTenantMiddleware } from './common/middleware/prisma-tenant.middleware';

@Controller('health')
class HealthController {
  @Get() check() { return { status: 'ok' }; }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule, AuthModule, UsersModule, OrganizationsModule, DepartmentsModule,
    ProjectsModule, AgentsModule, TasksModule, WorkflowsModule, DocumentsModule,
    ApprovalsModule, IntegrationsModule, AuditModule, AiClientModule,
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_INTERCEPTOR, useClass: AuditLogInterceptor }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PrismaTenantMiddleware).forRoutes('*');
  }
}
