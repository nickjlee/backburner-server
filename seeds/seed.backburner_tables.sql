BEGIN;

TRUNCATE
  backburner_users,
  backburner_tasks
  RESTART IDENTITY CASCADE;

INSERT INTO backburner_users (username, first_name, password)
VALUES
  ('demo1', 'Demo', 'password');

INSERT INTO backburner_tasks (text, due_date, reward, xp, user_id)
VALUES
  ('Give the dog a bath', '2019-07-01', 'my favorite desert', 50, 1),
  ('Plan the family vacation', '2019-09-30', 'night out with the friends', 75, 1),
  ('Finish MVP of First Capstone Project', '2019-06-07', 'a whole day off!', 100, 1);

COMMIT;