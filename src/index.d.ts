export {};

type User = {
  email: string;
  id: string;
  image?: string;
  name: string;
  role: 'USER';
};

type Trainer = {
  email: string;
  id: string;
  image?: string;
  name: string;
  role: 'USER';
};

declare global {
  namespace Express {
    export interface Request {
      user?: User;
      trainer?: Trainer;
    }
  }
}
