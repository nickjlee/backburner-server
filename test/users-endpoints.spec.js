const knex = require('knex')
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
    context(`User Validation`, () => {
      // TO DO
    })

    context(`Happy Path`, () => {
      beforeEach('seed tables', () => {
        helpers.seedUser(
          db,
          testUser
        )
      })

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
})