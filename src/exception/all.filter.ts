import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

export interface ValidationError {
  message: Message[];
  error: string;
  statusCode: number;
}

export interface Message {
  field: string;
  error: string[];
}

export interface GenericHTTPResponse {
  message: string;
  statusCode: number;
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    this.logger.debug(exception);

    const { message, stack } = exception;

    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const code = exception.getStatus();

    switch (code) {
      case HttpStatus.UNPROCESSABLE_ENTITY:
        const validationErrors = exception.getResponse() as ValidationError;

        return res.status(code).send({
          code,
          message: 'Failed validation',
          data: validationErrors.message,
        });

      case HttpStatus.UNAUTHORIZED:
        const unauthorizedError =
          exception.getResponse() as GenericHTTPResponse;
        return res.status(code).send({
          code,
          message: unauthorizedError.message,
        });

      case HttpStatus.BAD_REQUEST:
        return res.status(code).send({
          code,
          message: exception.getResponse(),
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
