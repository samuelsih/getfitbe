import { CustomError } from './customError.interface';

export class AlreadyExistsError extends Error implements CustomError {
  constructor(item: string) {
    super(`${item} already exists`);
  }

  public statusCode() {
    return 400;
  }
}
