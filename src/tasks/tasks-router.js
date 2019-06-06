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

tasksRouter.route('/').post(requireAuth, jsonBodyParser, (req, res, next) => {
  const { user_id = req.user.id, text, due_date, reward, xp } = req.body
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

tasksRouter.route('/:task_id')
  .all(checkTaskExists)
  .all(requireAuth)
  .delete((req, res, next) => {
    TasksService.deleteTask(
      req.app.get('db'),
      req.params.task_id
    )
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })

async function checkTaskExists(req, res, next) {
  try {
    const task = await TasksService.getById(
      req.app.get('db'),
      req.params.task_id
    )

    if(!task) {
      return res.status(404).json({
        error: 'Task does not exist'
      })
    }

    res.task = task
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = tasksRouter
