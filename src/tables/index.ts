import type { ColumnType, Kysely } from 'kysely';

type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

type Timestamp = ColumnType<Date, Date | string, Date | string>;

type UserRole = 'TRAINER' | 'USER';

interface Users {
  created_at: Generated<Timestamp>;
  email: string;
  email_verified: Timestamp | null;
  id: Generated<string>;
  image: string | null;
  name: string;
  password: string;
  role: UserRole;
  updated_at: Generated<Timestamp | null>;
}

interface Tables {
  users: Users;
}

export type DB = Kysely<Tables>;
