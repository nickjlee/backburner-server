BEGIN;

TRUNCATE
  backburner_users,
  backburner_tasks
  RESTART IDENTITY CASCADE;

INSERT INTO backburner_users (username, first_name, password, level)
VALUES
  ('demo1', 'Demo-1', 'password', 0),
  ('demo2', 'Demo-2', '12345', 13),
  ('demo3', 'Demo-3', 'demo', 4);

INSERT INTO backburner_tasks (text, due_date, reward, xp, user_id)
VALUES
  ('Give the dog a bath', '2019-07-01', 'my favorite desert', 50, 1),
  ('Plan the family vacation', '2019-09-30', 'night out with the friends', 75, 2),
  ('Finish MVP of First Capstone Project', '2019-06-07', 'a whole day off!', 100, 3),
  ('Give the dog a bath', '2019-07-01', 'my favorite desert', 50, 1),
  ('Plan the family vacation', '2019-09-30', 'night out with the friends', 75, 2),
  ('Finish MVP of First Capstone Project', '2019-06-07', 'a whole day off!', 100, 3),
  ('Give the dog a bath', '2019-07-01', 'my favorite desert', 50, 1),
  ('Plan the family vacation', '2019-09-30', 'night out with the friends', 75, 2),
  ('Finish MVP of First Capstone Project', '2019-06-07', 'a whole day off!', 100, 3),
  ('Give the dog a bath', '2019-07-01', 'my favorite desert', 50, 1),
  ('Plan the family vacation', '2019-09-30', 'night out with the friends', 75, 2),
  ('Finish MVP of First Capstone Project', '2019-06-07', 'a whole day off!', 100, 3),
  ('Give the dog a bath', '2019-07-01', 'my favorite desert', 50, 1),
  ('Plan the family vacation', '2019-09-30', 'night out with the friends', 75, 2),
  ('Finish MVP of First Capstone Project', '2019-06-07', 'a whole day off!', 100, 3),
  ('Give the dog a bath', '2019-07-01', 'my favorite desert', 50, 1),
  ('Plan the family vacation', '2019-09-30', 'night out with the friends', 75, 2),
  ('Finish MVP of First Capstone Project', '2019-06-07', 'a whole day off!', 100, 3),
  ('Give the dog a bath', '2019-07-01', 'my favorite desert', 50, 1),
  ('Plan the family vacation', '2019-09-30', 'night out with the friends', 75, 2),
  ('Finish MVP of First Capstone Project', '2019-06-07', 'a whole day off!', 100, 3),
  ('Give the dog a bath', '2019-07-01', 'my favorite desert', 50, 1),
  ('Plan the family vacation', '2019-09-30', 'night out with the friends', 75, 2),
  ('Finish MVP of First Capstone Project', '2019-06-07', 'a whole day off!', 100, 3),
  ('Give the dog a bath', '2019-07-01', 'my favorite desert', 50, 1),
  ('Plan the family vacation', '2019-09-30', 'night out with the friends', 75, 2),
  ('Finish MVP of First Capstone Project', '2019-06-07', 'a whole day off!', 100, 3),
  ('Give the dog a bath', '2019-07-01', 'my favorite desert', 50, 1),
  ('Plan the family vacation', '2019-09-30', 'night out with the friends', 75, 2),
  ('Finish MVP of First Capstone Project', '2019-06-07', 'a whole day off!', 100, 3),
  ('Give the dog a bath', '2019-07-01', 'my favorite desert', 50, 1),
  ('Plan the family vacation', '2019-09-30', 'night out with the friends', 75, 2),
  ('Finish MVP of First Capstone Project', '2019-06-07', 'a whole day off!', 100, 3),
  ('Give the dog a bath', '2019-07-01', 'my favorite desert', 50, 1),
  ('Plan the family vacation', '2019-09-30', 'night out with the friends', 75, 2),
  ('Finish MVP of First Capstone Project', '2019-06-07', 'a whole day off!', 100, 3),
  ('Give the dog a bath', '2019-07-01', 'my favorite desert', 50, 1),
  ('Plan the family vacation', '2019-09-30', 'night out with the friends', 75, 2),
  ('Finish MVP of First Capstone Project', '2019-06-07', 'a whole day off!', 100, 3),
  ('Give the dog a bath', '2019-07-01', 'my favorite desert', 50, 1),
  ('Plan the family vacation', '2019-09-30', 'night out with the friends', 75, 2),
  ('Finish MVP of First Capstone Project', '2019-06-07', 'a whole day off!', 100, 3),
  ('Give the dog a bath', '2019-07-01', 'my favorite desert', 50, 1),
  ('Plan the family vacation', '2019-09-30', 'night out with the friends', 75, 2),
  ('Finish MVP of First Capstone Project', '2019-06-07', 'a whole day off!', 100, 3),
  ('Give the dog a bath', '2019-07-01', 'my favorite desert', 50, 1),
  ('Plan the family vacation', '2019-09-30', 'night out with the friends', 75, 2),
  ('Finish MVP of First Capstone Project', '2019-06-07', 'a whole day off!', 100, 3);

COMMIT;