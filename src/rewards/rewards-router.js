const express = require('express')
const RewardsService = require('./rewards-service')
const { requireAuth } = require('../middleware/jwt-auth')

const rewardsRouter = express.Router()
const jsonBodyParser = express.json()

rewardsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    RewardsService.getUserRewards(req.app.get('db'), req.user.id)
      .then(rewards => {
        res.json(RewardsService.serializeRewards(rewards))
      })
      .catch(next)
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { reward, user_id = req.user.id } = req.body
    const newReward = { reward, user_id }

    if(newReward.reward == null) {
      return res.status(400).json({
        error: `Missing reward in request body`
      })
    }

    RewardsService.insertNewReward(req.app.get('db'), newReward)
      .then(reward => {
        res
          .status(201)
          .location()
          .json(RewardsService.serializeReward(reward))
      })
      .catch(next)
  })

rewardsRouter
  .route('/:reward_id')
  .all(checkRewardExists)
  .all(requireAuth)
  .delete((req, res, next) => {
    RewardsService.deleteReward(
      req.app.get('db'),
      req.params.reward_id
    )
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
    
  })

async function checkRewardExists(req, res, next) {
  try {
    const reward = await RewardsService.getById(
      req.app.get('db'),
      req.params.reward_id
    )

    if(!reward) {
      return res.status(404).json({
        error: 'Reward does not exist'
      })
    }

    res.reward = reward
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = rewardsRouter