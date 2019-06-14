const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Rewards Endpoints', function() {
  let db
  
  const testUser = helpers.makeUser()
  const testRewards = helpers.makeRewardsArray(testUser)

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

  describe(`GET /api/rewards`, () => {
    context('Given no rewards', () => {
      beforeEach(() => helpers.seedUser(db, testUser))

      it(`responds with 200 and empty response`, () => {
        return supertest(app)
          .get('/api/rewards')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200, [])
      })
    })

    context('Given rewards', () => {
      beforeEach('insert rewards', () =>
        helpers.seedRewards(db, testUser, testRewards)
      )

      it(`responds with 200 and all of the user's rewards`, () => {
        const expectedRewards = testRewards.map(reward =>
          helpers.makeExpectedReward(reward, testUser)
        )

        return supertest(app)
          .get('/api/rewards')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200, expectedRewards)
      })
    })

    context('Given an XSS attack reward', () => {
      const { maliciousReward, expectedReward } = helpers.makeMaliciousReward(testUser)

      beforeEach('insert malicious reward', () => {
        return helpers.seedMaliciousReward(db, testUser, maliciousReward)
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get('/api/rewards')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect(res => {
            expect(res.body[0].reward).to.eql(expectedReward.reward)
          })
      })
    })
  })

  describe(`POST /api/rewards`, () => {
    beforeEach('insert rewards', () =>
      helpers.seedRewards(db, testUser, testRewards)
    )

    it(`creates a reward, responds with 201 and the new reward`, function() {
      const newReward = {
        reward: 'New Test Reward'
      }

      return supertest(app)
        .post('/api/rewards')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(newReward)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.reward).to.eql(newReward.reward)
          expect(res.body.user_id).to.eql(testUser.id)
        })
        .expect(res => 
          db
            .from('backburner_rewards')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.reward).to.eql(newReward.reward)
              expect(row.user_id).to.eql(testUser.id)
            })
        )
    })

    it(`responds with 400 and 'Missing 'reward' in request body`, () => {
      const newReward = {}

      return supertest(app)
        .post('/api/rewards')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(newReward)
        .expect(400, { error: `Missing reward in request body` })
    })
  })

  describe(`DELETE /api/rewards/:reward_id`, () => {
    beforeEach('insert rewards', () => 
      helpers.seedRewards(db, testUser, testRewards)
    )

    it('responds with 204 and removes reward from db', () => {

      return supertest(app)
        .delete(`/api/rewards/${testRewards[0].id}`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(204)
        .expect(() =>
          db
            .from('backburner_rewards')
            .select('*')
            .where({ id: testRewards[0].id })
            .then(row => {
              expect(row).to.eql([])
            })
        )
    })
  })
})
