const xss = require('xss')
const Treeize = require('treeize')

const TasksService = {
  getAllTasks(db) {
    return db
      .from('backburner_tasks AS task')
      .select(
        'task.id',
        'task.text',
        'task.due_date',
        'task.reward',
        'task.xp'
      )
  },

  serializeTasks(tasks) {
    return tasks.map(this.serializeTask)
  },

  serializeTask(task) {
    const taskTree = new Treeize()

    const taskData = taskTree.grow([ task ]).getData()[0]

    return {
      id: taskData.id,
      text: xss(taskData.text),
      due_date: taskData.due_date,
      reward: xss(taskData.reward),
      xp: taskData.xp
    }
  }
}

module.exports = TasksService