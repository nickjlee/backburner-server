BEGIN;

TRUNCATE
  backburner_users,
  backburner_tasks
  RESTART IDENTITY CASCADE;

INSERT INTO backburner_users (username, first_name, password, level, xp)
VALUES
  ('demo', 'Demo', '$2a$12$Xtsip8DrajF4Va0dou5T9uLgDrWme3Mk/PWoCXLm5a9hK5fx6G5Ky', 0, 490);  -- password = 'password'
  -- ('demo2', 'Demo-2', '$2a$12$WJFfSXfZEpXIyGfhUoGUt.gn8HjcVSkwRD.j8/Q2e/LlzhmYK0OVi', 13), -- password = '12345'
  -- ('demo3', 'Demo-3', '$2a$12$Kx1KcC51cjmqo7HklDLGaO2dxJ0ykPiqddi7QB0b0XN4hoYPpB6cq', 4);  -- password = 'demo'

INSERT INTO backburner_tasks (text, due_date, reward, xp, user_id)
VALUES
  ('Give the dog a bath', '2019-08-01', 'my favorite desert', 50, 1),
  ('Plan the family vacation', '2019-09-30', 'night out with the friends', 75, 1),
  ('Finish MVP of First Capstone Project', '2019-07-07', 'a whole day off!', 100, 1),
  ('Administer flea medication for the cat', '2019-10-01', '1h of video game', 50, 1);  

COMMIT;