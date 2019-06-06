CREATE TABLE backburner_users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  password TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 0,
  date_joined DATE NOT NULL DEFAULT CURRENT_DATE
);

ALTER TABLE backburner_tasks
  ADD COLUMN
    user_id INTEGER REFERENCES backburner_users(id)
    ON DELETE SET NULL;