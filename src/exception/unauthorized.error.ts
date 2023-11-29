import { CustomError } from './customError.interface';

export class UnauthorizedError extends Error implements CustomError {
  constructor() {
    super(`Unauthorized`);
  }

  public statusCode() {
    return 401;
  }
}
