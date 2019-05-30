const xss = require('xss')
const Treeize = require('treeize')

const TasksService = {
  getAllTasks(db) {
    return db
      .from('backburner_tasks AS tsk')
      .select(
        'tsk.id',
        'tsk.text',
        'tsk.due_date',
        'tsk.reward',
        'tsk.xp',
        ...userFields,
      )
      .leftJoin(
        'backburner_users AS usr',
        'tsk.user_id',
        'usr.id'
      )
      .groupBy('tsk.id', 'usr.id')
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
      xp: taskData.xp,
      user: taskData.user || {}
    }
  }
}

const userFields = [
  'usr.id AS user:id',
  'usr.username AS user:username',
  'usr.first_name AS user:first_name',
  'usr.level AS user:level',
  'usr.date_joined AS user:date_joined'
]

module.exports = TasksService