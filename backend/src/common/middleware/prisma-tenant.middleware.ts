import { Injectable, NestMiddleware } from '@nestjs/common';

/** Normalises the tenant header early; actual membership verification happens in TenantGuard. */
@Injectable()
export class PrismaTenantMiddleware implements NestMiddleware {
  use(req: any, _res: any, next: () => void) {
    const h = req.headers['x-organization-id'];
    if (typeof h === 'string') req.headers['x-organization-id'] = h.trim();
    next();
  }
}
