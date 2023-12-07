import { User } from './modules/auth/entity/user.entity';

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
