ALTER TABLE backburner_tasks
  DROP COLUMN IF EXISTS user_id;

DROP TABLE IF EXISTS backburner_users;