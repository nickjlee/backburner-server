const knex = require('knex')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Auth Endpoints', function() {
  let db

  const testUser = helpers.makeUser()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`POST /api/auth/login`, () => {
    beforeEach('insert user', () => helpers.seedUser(db, testUser))

    const requiredFields = ['username', 'password']

    requiredFields.forEach(field => {
      const loginAttemptBody = {
        username: testUser.username,
        password: testUser.password
      }

      it(`responds with 400 'Missing '${field}' in request body when ${field} is missing`, () => {
        delete loginAttemptBody[field]

        return supertest(app)
          .post('/api/auth/login')
          .send(loginAttemptBody)
          .expect(400, { error: `Missing '${field}' in request body` })
      })
    })

    it(`responds with 400 'Invalid username or password' when bad username`, () => {
      const userInvalidUserName = { username: 'user-not', password: 'existy' }

      return supertest(app)
        .post('/api/auth/login')
        .send(userInvalidUserName)
        .expect(400, { error: 'Invalid username or password' })
    })

    it(`responds with 400 'Invalid username or password' when bad password`, () => {
      const userInvalidUserPass = { username: testUser.username, password: 'invalid' }

      return supertest(app)
        .post('/api/auth/login')
        .send(userInvalidUserPass)
        .expect(400, { error: 'Invalid username or password' })
    })

    it(`responds with 200 and JWT auth token when user secret with valid credentials`, () => {
      const userValidCreds = {
        username: testUser.username,
        password: testUser.password
      }

      const expectedToken = jwt.sign(
        { user_id: testUser.id },
        process.env.JWT_SECRET,
        {
          subject: testUser.username,
          algorithm: 'HS256'
        }
      )

      return supertest(app)
        .post('/api/auth/login')
        .send(userValidCreds)
        .expect(200, {
          authToken: expectedToken
        })
    })
  })
})
