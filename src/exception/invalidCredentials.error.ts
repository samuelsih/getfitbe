import { CustomError } from './customError.interface';

export class InvalidCredentialsError extends Error implements CustomError {
  constructor(user: string) {
    super(`Invalid credentials for ${user}`);
  }

  public statusCode() {
    return 400;
  }
}
