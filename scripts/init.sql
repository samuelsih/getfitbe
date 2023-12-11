CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE user_role as ENUM ('USER', 'TRAINER');

CREATE TABLE
  users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(320) NOT NULL unique,
    email_verified TIMESTAMPTZ,
    password text NOT NULL,
    image text,
    role user_role NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  trainer_id uuid NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES users(id),
  CONSTRAINT fk_trainer_id FOREIGN KEY(trainer_id) REFERENCES users(id)
);

CREATE TABLE messages (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  conversation_id uuid NOT NULL,
  sender_id uuid NOT NULL,
  content VARCHAR(500) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_conversation_id FOREIGN KEY(conversation_id) REFERENCES conversations(id),
  CONSTRAINT fk_sender_id FOREIGN KEY(sender_id) REFERENCES users(id)
);

CREATE INDEX messages_created_at_idx ON messages (created_at);
CREATE INDEX user_role_idx ON users(role);

CREATE FUNCTION
  update_updated_at_column() RETURNS trigger LANGUAGE plpgsql AS $$
  BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
  END;
$$;

CREATE TRIGGER
  users_updated_at_modtime 
BEFORE UPDATE
  ON users FOR EACH ROW
EXECUTE
  PROCEDURE update_updated_at_column();

CREATE TABLE user_upload_img (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  img_url text NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
);
  

-- DUMMY TRAINER
INSERT INTO
  users (name, email, password, role)
VALUES
  (
    'John Doe',
    'john@mail.com',
    crypt ('password', gen_salt ('bf')),
    'TRAINER'
  ),
  (
    'Jane Smith',
    'jane@mail.com',
    crypt ('password', gen_salt ('bf')),
    'TRAINER'
  ),
  (
    'Bob Johnson',
    'bob@mail.com',
    crypt ('password', gen_salt ('bf')),
    'TRAINER'
  )