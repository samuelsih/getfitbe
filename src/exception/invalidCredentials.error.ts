import { HttpException } from '@nestjs/common';

export class InvalidCredentialsError extends HttpException {
  constructor(item: string) {
    super(`Invalid credentials for ${item}`, 400);
  }
}
