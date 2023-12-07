export {};

type User = {
  email: string;
  id: string;
  image?: string;
  name: string;
  emailVerified?: Date;
  role: 'USER';
  createdAt: Date;
  updatedAt: Date;
};

type Trainer = {
  email: string;
  id: string;
  image?: string;
  name: string;
  emailVerified?: Date;
  role: 'TRAINER';
  createdAt: Date;
  updatedAt: Date;
};

declare global {
  namespace Express {
    export interface Request {
      user?: User;
      trainer?: Trainer;
    }
  }
}
