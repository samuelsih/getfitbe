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
    created_at TIMESTAMPTZ NOT NULL DEFAULT 'now'::timestamp,
    updated_at TIMESTAMPTZ DEFAULT 'now'::timestamp
  );

CREATE FUNCTION
  update_updated_at_column() RETURNS trigger LANGUAGE plpgsql AS $$
  BEGIN
    NEW.updated_at = NOW();
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
  created_at TIMESTAMPTZ NOT NULL DEFAULT 'now'::timestamp,
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
);
  