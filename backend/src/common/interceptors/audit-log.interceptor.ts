import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../prisma/prisma.service';

/** Records every successful mutating request in audit_logs. */
@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}
  intercept(ctx: ExecutionContext, next: CallHandler) {
    const req = ctx.switchToHttp().getRequest();
    if (!['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method)) return next.handle();
    return next.handle().pipe(
      tap(() => {
        if (!req.user?.id) return;
        const parts = String(req.route?.path ?? req.url).split('/').filter(Boolean);
        this.prisma.auditLog
          .create({
            data: {
              organizationId: req.organizationId ?? null,
              userId: req.user.id,
              action: req.method,
              entity: parts[0] ?? 'unknown',
              entityId: req.params?.id ?? null,
              meta: { path: req.originalUrl },
            },
          })
          .catch(() => undefined);
      }),
    );
  }
}
