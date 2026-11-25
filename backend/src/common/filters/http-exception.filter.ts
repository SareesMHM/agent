import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger('Exceptions');
  catch(e: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();
    const status = e instanceof HttpException ? e.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const body = e instanceof HttpException ? e.getResponse() : { message: 'Internal server error' };
    if (status >= 500) this.logger.error(e);
    res.status(status).json(typeof body === 'string' ? { message: body } : body);
  }
}
