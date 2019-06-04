const xss = require('xss')
const Treeize = require('treeize')

const TasksService = {
  getUserTasks(db, user_id) {
    return db
      .from('backburner_tasks AS tsk')
      .select(
        'tsk.id',
        'tsk.text',
        'tsk.due_date',
        'tsk.reward',
        'tsk.xp',
      )
      .where(
        'tsk.user_id', user_id
      )
  },

  insertNewTask(db, newTask) {
    return db
      .insert(newTask)
      .into('backburner_tasks')
      // .returning('*')
      // .then(([task]) => task)
      // .then(task =>
      //   TasksService.get)
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