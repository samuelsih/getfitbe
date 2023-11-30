import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export const customValidationPipe = new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  exceptionFactory(errors: ValidationError[] = []) {
    return new UnprocessableEntityException(
      errors.map((error) => ({
        field: error.property,
        error: Object.values(error.constraints),
      })),
    );
  },
});
