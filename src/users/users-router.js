const express = require('express')
const UsersService = require('./users-service')
const { requireAuth } = require('../middleware/jwt-auth')

const usersRouter = express.Router()

usersRouter
  .route('/')
  .get(requireAuth, (req, res, next) => {
    UsersService.getUserByUsername(req.app.get('db'), req.user.username)
      .then(user => {
        res.json(UsersService.serializeUser(user))
      })
      .catch(next)
  })

module.exports = usersRouter