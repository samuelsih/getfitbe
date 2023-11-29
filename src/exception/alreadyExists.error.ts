import { CustomError } from './customError.interface';

export class AlreadyExistsError extends Error implements CustomError {
  private readonly statusCode = 400;

  constructor(item: string) {
    super(`${item} already exists`);
  }

  public code() {
    return this.statusCode;
  }
}
