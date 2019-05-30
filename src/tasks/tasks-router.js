const express = require('express')
const TasksService = require('./tasks-service')

const tasksRouter = express.Router()

tasksRouter
  .route('/:user_id')
  .get((req, res, next) => {
    TasksService.getUserTasks(req.app.get('db'), req.params.user_id)
      .then(tasks => {
        res.json(TasksService.serializeTasks(tasks))
      })
      .catch(next)
  })

module.exports = tasksRouter