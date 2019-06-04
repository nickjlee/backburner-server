const express = require('express')
const RewardsService = require('./rewards-service')
const { requireAuth } = require('../middleware/jwt-auth')

const rewardsRouter = express.Router()
const jsonBodyParser = express.json()

rewardsRouter
  .route('/')
  .get(requireAuth, (req, res, next) => {
    RewardsService.getUserRewards(req.app.get('db'). req.user.id)
      .then(rewards => {
        res.json(RewardsService.serializeRewards(rewards))
      })
      .catch(next)
  })

rewardsRouter
  .route('/')
  .all(requireAuth)
  .post(jsonBodyParser, (req, res, next) => {
    const { reward } = req.body
    const newReward = { reward }

    if(newReward.reward.value == null) {
      return res.status(400).json({
        error: `Missing reward in request body`
      })
    }

    RewardsService.insertNewReward(req.app.get('db'), newReward)
      .then(reward => {
        res
          .status(201)
          .json(RewardsService.serializeReward(reward))
      })
      .catch(next)
  })

  module.exports = rewardsRouter