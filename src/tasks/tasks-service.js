const xss = require('xss')
const Treeize = require('treeize')

const TasksService = {
  getById(db, task_id) {
    return db
      .from('backburner_tasks')
      .where('id', task_id)
      .first()
  },

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
      .returning('*')
      .then(([task]) => task)
      .then(task =>
        TasksService.getById(db, task.id)
      )
  },

  deleteTask(db, taskID) {
    return db
      .from('backburner_tasks')
      .where('id', taskID)
      .delete()
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

module.exports = TasksService