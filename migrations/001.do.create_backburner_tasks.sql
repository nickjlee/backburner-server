CREATE TABLE backburner_tasks (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  due_date TIMESTAMP,
  reward TEXT,
  xp NUMERIC NOT NULL
);