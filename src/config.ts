import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export const customValidationPipe = new ValidationPipe({
  exceptionFactory(errors: ValidationError[] = []) {
    return new UnprocessableEntityException({
      code: 422,
      message: 'Failed validation',
      data: errors.map((error) => ({
        field: error.property,
        error: Object.values(error.constraints),
      })),
    });
  },
});
