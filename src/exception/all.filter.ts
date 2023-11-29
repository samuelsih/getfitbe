import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { isCustomError } from './customError.interface';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const { message } = exception;

    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    switch (true) {
      case isCustomError(exception):
        return res.status(exception.code()).send({
          code: exception.code(),
          message,
        });

      default:
        return res.status(500).json({
          code: 500,
          message: 'Internal server error',
        });
    }
  }
}
