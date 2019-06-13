const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUser() {
  return {
    id: 1,
    username: 'testUser-1',
    first_name: 'test1',
    password: 'Pa$$w0rd',
    level: 1,
    xp: 100,
    xp_to_next_level: 500,
    date_joined: '2019-01-01'
  }
  // {
  //   id: 1,
  //   username: 'testUser-1',
  //   first_name: 'test1',
  //   password: 'Pa$$w0rd',
  //   level: 1,
  //   xp: 100,
  //   xp_to_next_level: 500,
  //   date_joined: '2019-01-01'
  // },
  // {
  //   id: 2,
  //   username: 'testUser-2',
  //   first_name: 'test2',
  //   password: 'Pa$$w0rd',
  //   level: 1,
  //   xp: 200,
  //   xp_to_next_level: 500,
  //   date_joined: '2019-02-02'
  // },
  // {
  //   id: 3,
  //   username: 'testUser-3',
  //   first_name: 'test3',
  //   password: 'Pa$$w0rd',
  //   level: 1,
  //   xp: 300,
  //   xp_to_next_level: 500,
  //   date_joined: '2019-03-03'
  // },
  // {
  //   id: 4,
  //   username: 'testUser-4',
  //   first_name: 'test4',
  //   password: 'Pa$$w0rd',
  //   level: 1,
  //   xp: 400,
  //   xp_to_next_level: 500,
  //   date_joined: '2019-04-04'
  // }
}

function makeTasksArray(user) {
  return [
    {
      id: 1,
      text: 'First Task to do...',
      due_date: '2019-08-01',
      reward: 'first test reward',
      xp: 10,
      user_id: user.id
    },
    {
      id: 2,
      text: 'Second Task to do...',
      due_date: '2019-09-01',
      reward: 'second test reward',
      xp: 25,
      user_id: user.id
    },
    {
      id: 3,
      text: 'Third Task to do...',
      due_date: '2019-10-01',
      reward: 'third test reward',
      xp: 50,
      user_id: user.id
    },
    {
      id: 4,
      text: 'Fourth Task to do...',
      due_date: '2019-11-01',
      reward: 'fourth test reward',
      xp: 75,
      user_id: user.id
    },
    {
      id: 5,
      text: 'Fifth Task to do...',
      due_date: '2019-12-01',
      reward: 'fifth test reward',
      xp: 100,
      user_id: user.id
    }
  ]
}

function makeRewardsArray(user) {
  return [
    {
      id: 1,
      reward: 'Test Reward 1',
      user_id: user.id
    },
    {
      id: 2,
      reward: 'Test Reward 2',
      user_id: user.id
    },
    {
      id: 3,
      reward: 'Test Reward 3',
      user_id: user.id
    }
  ]
}

function seedUser(db, user) {
  const preppedUser = {
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }

  return db.into('backburner_users').insert(preppedUser)
    .then(() =>
      db.raw(
        `SELECT setval('backburner_users_id_seq', ?)`,
        [user.id]
      )
    )
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      backburner_users,
      backburner_tasks,
      backburner_rewards
      RESTART IDENTITY CASCADE;`
  )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256'
  })

  return `Bearer ${token}`
}

module.exports = {
  makeUser,
  makeTasksArray,
  makeRewardsArray,
  seedUser,
  cleanTables,
  makeAuthHeader,
}
