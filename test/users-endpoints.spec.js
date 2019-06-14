const knex = require('knex')
const bcrypt = require('bcryptjs')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Users Endpoints', function() {
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

  describe(`GET /api/users`, () => {
    context(`Happy Path`, () => {
      beforeEach('seed tables', () =>
        helpers.seedUser(db, testUser)
      )

      it(`responds with 200 and serialized user info in body`, () => {
        return supertest(app)
          .get('/api/users')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect(res => {
            expect(res.body).to.have.property('id')
            expect(res.body.username).to.eql(testUser.username)
            expect(res.body.first_name).to.eql(testUser.first_name)
            expect(res.body.level).to.eql(testUser.level)
            expect(res.body.xp).to.eql(testUser.xp)
            expect(res.body.xp_to_next_level).to.eql(testUser.xp_to_next_level)
            const expectedDate = new Date(testUser.date_joined).toLocaleString()
            const actualDate = new Date(res.body.date_joined).toLocaleString()
            expect(actualDate).to.eql(expectedDate)
          })
      })
    })
  })

  describe(`POST /api/users`, () => {
    context('User Validation', () => {
      beforeEach('insert user', () => helpers.seedUser(db, testUser))

      const requiredFields = ['username', 'password', 'first_name']

      requiredFields.forEach(field => {
        const registerAttemptBody = {
          username: 'newTestUser',
          password: 'Pa$$w0rd',
          first_name: 'Test'
        }

        it(`responds with 400 'Missing '${field}' in request body`, () => {
          delete registerAttemptBody[field]

          return supertest(app)
            .post('/api/users')
            .send(registerAttemptBody)
            .expect(400, { error: `Missing '${field}' in request body` })
        })
      })

      it(`responds with 400 'Password must be longer than 8 characters'`, () => {
        const userShortPass = {
          username: 'newTestUser',
          password: 'Pa$$0',
          first_name: 'Test'
        }

        return supertest(app)
          .post('/api/users')
          .send(userShortPass)
          .expect(400, { error: 'Password must be longer than 8 characters' })
      })

      it(`responds with 400 'Password should be less than 72 characters'`, () => {
        const userLongPass = {
          username: 'newTestUser',
          password: '*'.repeat(73),
          first_name: 'Test'
        }

        return supertest(app)
          .post('/api/users')
          .send(userLongPass)
          .expect(400, { error: 'Password should be less than 72 characters' })
      })

      it(`responds with 400 'Password must not start or end with empty space' when password starts with space`, () => {
        const userPassStartsWithSpace = {
          username: 'newTestUser',
          password: ' 11AAaa!!',
          first_name: 'Test'
        }

        return supertest(app)
          .post('/api/users')
          .send(userPassStartsWithSpace)
          .expect(400, {
            error: 'Password must not start or end with empty space'
          })
      })

      it(`responds with 400 'Password must not start or end with empty space' when password ends with space`, () => {
        const userPassStartsWithSpace = {
          username: 'newTestUser',
          password: '11AAaa!! ',
          first_name: 'Test'
        }

        return supertest(app)
          .post('/api/users')
          .send(userPassStartsWithSpace)
          .expect(400, {
            error: `Password must not start or end with empty space`
          })
      })

      it(`responds with 400 'Password must contain 1 Uppercase, 1 Lowercase, 1 Number, and 1 Special Character'`, () => {
        const userPassNotComplex = {
          username: 'newTestUser',
          password: '11AAaabb',
          first_name: 'Test'
        }

        return supertest(app)
          .post('/api/users')
          .send(userPassNotComplex)
          .expect(400, {
            error: `Password must contain 1 Uppercase, 1 Lowercase, 1 Number, and 1 Special Character`
          })
      })

      it(`responds with 400 'Username already taken' when user_name not unique`, () => {
        const duplicateUser = {
          username: testUser.username,
          password: '11AAaa!!',
          first_name: 'Test'
        }

        return supertest(app)
          .post('/api/users')
          .send(duplicateUser)
          .expect(400, { error: `Username is already taken` })
      })
    })

    context('Happy Path', () => {
      const newUser = {
        username: 'New Test User',
        password: 'Pa$$w0rd',
        first_name: 'Test'
      }

      it(`responds with 201, serialized user, and stores bcrypted password`, function() {
        return supertest(app)
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property('id')
            expect(res.body.username).to.eql(newUser.username)
            expect(res.body.first_name).to.eql(newUser.first_name)
            expect(res.body).to.not.have.property('password')
            expect(res.body.level).to.eql(0)
            expect(res.body.xp).to.eql(0)
            expect(res.body.xp_to_next_level).to.eql(500)
            expect(res.headers.location).to.eql('/api/users')
            const expectedDate = new Date().toLocaleDateString()
            const actualDate = new Date(
              res.body.date_joined
            ).toLocaleDateString()
            expect(actualDate).to.eql(expectedDate)
          })
          .expect(res => {
            return db
              .from('backburner_users')
              .select('*')
              .where({ id: res.body.id })
              .first()
              .then(row => {
                expect(row.username).to.eql(newUser.username)
                expect(row.first_name).to.eql(newUser.first_name)
                const expectedDate = new Date().toLocaleDateString()
                const actualDate = new Date(
                  row.date_joined
                ).toLocaleDateString()
                expect(actualDate).to.eql(expectedDate)

                return bcrypt.compare(newUser.password, row.password)
              })
              .then(compareMatch => {
                expect(compareMatch).to.be.true
              })
          })
      })
    })
  })

  describe(`PATCH /api/users`, () => {
    beforeEach('insert user', () => helpers.seedUser(db, testUser))

    it(`responds with 400 when missing 'gained_xp' in request body`, () => {
      const updateData = {
        missing: 'field'
      }

      return supertest(app)
        .patch('/api/users')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(updateData)
        .expect(400, { error: `Request body must contain 'gained_xp'` })
    })

    it(`Gained XP: responds with 200 and updated user xp`, () => {
      const updateData = {
        gained_xp: 100
      }

      return supertest(app)
        .patch('/api/users')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(updateData)
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.username).to.eql(testUser.username)
          expect(res.body.first_name).to.eql(testUser.first_name)
          expect(res.body.xp).to.eql(testUser.xp + updateData.gained_xp)
          const expectedDate = new Date(
            testUser.date_joined
          ).toLocaleDateString()
          const actualDate = new Date(res.body.date_joined).toLocaleDateString()
          expect(actualDate).to.eql(expectedDate)
        })
        .expect(res =>
          db
            .from('backburner_users')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.username).to.eql(testUser.username)
              expect(row.first_name).to.eql(testUser.first_name)
              expect(row.xp).to.eql(testUser.xp + updateData.gained_xp)
            })
        )
    })

    it(`Gained XP -> Level Up!: responds with 200 and update user xp, level, and xp_to_next_level`, () => {
      const updateData = {
        gained_xp: 500
      }

      return supertest(app)
        .patch('/api/users')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(updateData)
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.username).to.eql(testUser.username)
          expect(res.body.first_name).to.eql(testUser.first_name)
          expect(res.body.level).to.eql(testUser.level + 1)
          expect(res.body.xp).to.eql(testUser.xp + updateData.gained_xp - testUser.xp_to_next_level)
          expect(res.body.xp_to_next_level).to.eql(Math.ceil(testUser.xp_to_next_level * 1.1))
          const expectedDate = new Date(testUser.date_joined).toLocaleDateString()
          const actualDate = new Date(res.body.date_joined).toLocaleDateString()
          expect(actualDate).to.eql(expectedDate)
        })
        .expect(res =>
          db
            .from('backburner_users')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.username).to.eql(testUser.username)
              expect(row.first_name).to.eql(testUser.first_name)
              expect(row.level).to.eql(testUser.level + 1)
              expect(row.xp).to.eql(testUser.xp + updateData.gained_xp - testUser.xp_to_next_level)
              expect(row.xp_to_next_level).to.eql(Math.ceil(testUser.xp_to_next_level * 1.1))
            })
        )
    })
  })
})
