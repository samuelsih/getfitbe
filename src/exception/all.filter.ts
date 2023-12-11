import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Catch()
export class AllFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    this.logger.error({ exception: exception });

    return res.status(500).send({
      code: 500,
      message: 'Internal server error',
    });
  }
}
