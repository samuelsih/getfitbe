import { HttpException } from '@nestjs/common';

export class AlreadyExistsError extends HttpException {
  constructor(item: string) {
    super(`${item} already exists`, 400);
  }
}
