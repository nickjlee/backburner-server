const express = require('express')
const TasksService = require('./tasks-service')

const tasksRouter = express.Router()

tasksRouter
  .route('/')
  .get((req, res, next) => {
    TasksService.getAllTasks(req.app.get('db'))
      .then(tasks => {
        res.json(TasksService.serializeTasks(tasks))
      })
      .catch(next)
  })

module.exports = tasksRouter