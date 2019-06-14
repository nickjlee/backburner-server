'use strict'

require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const corsOptions = require('./cors-whitelist')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const tasksRouter = require('./tasks/tasks-router')
const usersRouter = require('./users/users-router')
const authRouter = require('./auth/auth-router')
const rewardsRouter = require('./rewards/rewards-router')

const app = express()
app.use(express.json())

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'dev'

app.use(morgan(morganOption))
app.use(cors({ origin: corsOptions }))
app.use(helmet())

app.use('/api/users', usersRouter)
app.use('/api/tasks', tasksRouter)
app.use('/api/auth', authRouter)
app.use('/api/rewards', rewardsRouter)

app.use('/', (req, res) => {
  res.send(`
    <h1>BackBurner Server</h1>

    <h2>This is the backend server for <a href='https://backburner.now.sh'>BackBurner</a></h2>
    <h4>"BackBurner is a task management service that motivates you by allowing you to turn your life into an RPG"</h4>
    <br/><br/>
    <h2>You probably did not mean to come here...</h2>
  `)
})

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app
