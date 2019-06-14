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

function makeExpectedTask(task) {
  return {
    id: task.id,
    text: task.text,
    due_date: task.due_date + 'T00:00:00.000Z',
    reward: task.reward,
    xp: task.xp.toString()
  }
}

function makeExpectedReward(reward, user) {
  return {
    id: reward.id,
    reward: reward.reward,
    user_id: Number(user.id)
  }
}

function makeMaliciousTask(user) {
  const maliciousTask = {
    id: 1,
    text: 'Naughty naughty very naughty <script>alert("xss");</script>',
    due_date: '2019-08-01',
    reward:
      'Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
    xp: 100,
    user_id: user.id
  }

  const expectedTask = {
    ...makeExpectedTask(maliciousTask),
    text: 'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    reward: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
  }

  return {
    maliciousTask,
    expectedTask
  }
}

function makeMaliciousReward(user) {
  const maliciousReward = {
    id: 1,
    reward: 'Naughty naughty very naughty <script>alert("xss");</script>',
    user_id: Number(user.id)
  }

  const expectedReward = {
    ...makeExpectedReward(maliciousReward, user),
    reward: 'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;'
  }

  return {
    maliciousReward,
    expectedReward
  }
}

function seedUser(db, user) {
  const preppedUser = {
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }

  return db
    .into('backburner_users')
    .insert(preppedUser)
    .then(() =>
      db.raw(`SELECT setval('backburner_users_id_seq', ?)`, [user.id])
    )
}

function seedTasks(db, user, tasks) {
  return db.transaction(async trx => {
    await seedUser(trx, user)
    await trx.into('backburner_tasks').insert(tasks)

    await trx.raw(`SELECT setval('backburner_tasks_id_seq', ?)`, [
      tasks[tasks.length - 1].id
    ])
  })
}

function seedRewards(db, user, rewards) {
  return db.transaction(async trx => {
    await seedUser(trx, user)
    await trx.into('backburner_rewards').insert(rewards)

    await trx.raw(`SELECT setval('backburner_rewards_id_seq', ?)`, [
      rewards[rewards.length - 1].id
    ])
  })
}

function seedMaliciousTask(db, user, task) {
  return seedUser(db, user).then(() =>
    db.into('backburner_tasks').insert([task])
  )
}

function seedMaliciousReward(db, user, reward) {
  return seedUser(db, user).then(() =>
    db.into('backburner_rewards').insert([reward])
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
  makeExpectedTask,
  makeExpectedReward,
  makeMaliciousTask,
  makeMaliciousReward,
  seedUser,
  seedTasks,
  seedRewards,
  seedMaliciousTask,
  seedMaliciousReward,
  cleanTables,
  makeAuthHeader
}
