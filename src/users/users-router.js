const express = require('express')
const UsersService = require('./users-service')

const usersRouter = express.Router()

usersRouter
  .route('/:username')
  .get((req, res, next) => {
    UsersService.getUserByUsername(req.app.get('db'), req.params.username)
      .then(user => {
        res.json(UsersService.serializeUser(user))
      })
      .catch(next)
  })

module.exports = usersRouter