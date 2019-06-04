const express = require('express')
const path = require('path')
const TasksService = require('./tasks-service')
const { requireAuth } = require('../middleware/jwt-auth')

const tasksRouter = express.Router()
const jsonBodyParser = express.json()

tasksRouter.route('/').get(requireAuth, (req, res, next) => {
  TasksService.getUserTasks(req.app.get('db'), req.user.id)
    .then(tasks => {
      res.json(TasksService.serializeTasks(tasks))
    })
    .catch(next)
})

tasksRouter.route('/').post(jsonBodyParser, (req, res, next) => {
  const { user_id, text, due_date, reward, xp } = req.body
  const newTask = { user_id, text, due_date, reward, xp }

  for (const [key, value] of Object.entries(newTask)) {
    if (value == null) {
      return res.status(400).json({
        error: `Missing '${key}' in request body`
      })
    }
  }

  TasksService.insertNewTask(req.app.get('db'), newTask)
    .then(task => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${user_id}`))
        .json(TasksService.serializeTask(task))
    })
    .catch(next)
})

module.exports = tasksRouter
