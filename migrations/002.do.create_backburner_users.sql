CREATE TABLE backburner_users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  password TEXT NOT NULL,
  date_created TIMESTAMP NOT NULL DEFAULT now()
);

ALTER TABLE backburner_tasks
  ADD COLUMN
    user_id INTEGER REFERENCES backburner_users(id)
    ON DELETE SET NULL;