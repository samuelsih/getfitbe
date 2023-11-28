import type { GeneratedAlways } from 'kysely';

interface User {
  id: GeneratedAlways<string>;
  name: string | null;
  email: string;
  email_verified: Date | null;
  image: string | null;
  password: string;
}

export interface Tables {
  users: User;
}
