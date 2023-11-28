CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
  