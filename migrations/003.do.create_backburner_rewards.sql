CREATE TABLE backburner_rewards (
  id SERIAL PRIMARY KEY,
  reward TEXT NOT NULL,
  user_id INTEGER REFERENCES backburner_users(id) ON DELETE SET NULL
);