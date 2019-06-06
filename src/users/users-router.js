const express = require('express')
const path = require('path')
const UsersService = require('./users-service')
const { requireAuth } = require('../middleware/jwt-auth')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
  .route('/')
  .get(requireAuth, (req, res, next) => {
    UsersService.getUserByUsername(req.app.get('db'), req.user.username)
      .then(user => {
        res.json(UsersService.serializeUser(user))
      })
      .catch(next)
  })

usersRouter
  .route('/')
  .post(jsonBodyParser, (req, res, next) => {
    const { password, username, first_name } = req.body

    for(const field of ['username', 'password', 'first_name']) {
      if(!req.body[field]) {
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })
      }
    }

    const passwordError = UsersService.validatePassword(password)
    if(passwordError) {
      return res.status(400).json({ error: passwordError })
    }

    UsersService.hasUserWithUserName(
      req.app.get('db'),
      username
    )
      .then(hasUserWithUserName => {
        if(hasUserWithUserName) {
          return res.status(400).json({ error: 'Username is already taken' })
        }

        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              username,
              password: hashedPassword,
              first_name
            }

            return UsersService.insertNewUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl))
                  .json(UsersService.serializeUser(user))
              })
          })
      })
      .catch(next)
  })

module.exports = usersRouter