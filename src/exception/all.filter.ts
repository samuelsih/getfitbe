import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { Response } from 'express';
import { isCustomError } from './customError.interface';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  catch(exception: Error, host: ArgumentsHost) {
    const { message, stack } = exception;

    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const status = exception as HttpException;
    if (status.getStatus() === 404) {
      return res.status(404).send({
        code: 404,
        message: 'Not found',
      });
    }

    switch (true) {
      case isCustomError(exception):
        this.logger.verbose(message);
        return res.status(exception.statusCode()).send({
          code: exception.statusCode(),
          message,
        });

      default:
        this.logger.error({
          message,
          stack,
        });
        return res.status(500).json({
          code: 500,
          message: 'Internal server error',
        });
    }
  }
}
