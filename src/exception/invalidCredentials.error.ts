import { CustomError } from './customError.interface';

export class InvalidCredentialsError extends Error implements CustomError {
  private readonly statusCode = 400;

  constructor(user: string) {
    super(`Invalid credentials for ${user}`);
  }

  public code() {
    return this.statusCode;
  }
}
