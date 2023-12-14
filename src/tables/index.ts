import type { ColumnType, Kysely } from 'kysely';

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type UserRole = 'TRAINER' | 'USER';

export interface Conversations {
  created_at: Generated<Timestamp>;
  id: Generated<string>;
  trainer_id: string;
  user_id: string;
}

export interface Messages {
  content: string;
  conversation_id: string;
  created_at: Generated<Timestamp>;
  id: Generated<number>;
  sender_id: string;
}

export interface Users {
  created_at: Generated<Timestamp>;
  email: string;
  email_verified: Timestamp | null;
  id: Generated<string>;
  image: string | null;
  name: string;
  bio: string | null;
  password: string;
  role: UserRole;
  updated_at: Generated<Timestamp | null>;
}

export interface UserUploadImg {
  created_at: Generated<Timestamp>;
  id: Generated<string>;
  img_url: string;
  user_id: string;
}

export interface Tables {
  conversations: Conversations;
  messages: Messages;
  user_upload_img: UserUploadImg;
  users: Users;
}

export type DB = Kysely<Tables>;
