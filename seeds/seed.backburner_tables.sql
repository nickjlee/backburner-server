BEGIN;

INSERT INTO backburner_tasks (text, due_date, reward, xp)
VALUES
  ('Give the dog a bath', '2019-07-01', 'my favorite desert', 50),
  ('Plan the family vacation', '2019-09-30', 'night out with the friends', 75),
  ('Finish MVP of First Capstone Project', '2019-06-07', 'a whole day off!', 100);

COMMIT;