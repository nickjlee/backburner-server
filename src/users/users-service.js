const xss = require('xss')
const Treeize = require('treeize')

const UsersService = {
  getUserByUsername(db, username) {
    return db
      .from('backburner_users AS usr')
      .where('usr.username', username)
      .first()
  },

  serializeUser(user) {
    const userTree = new Treeize()

    const userData = userTree.grow([ user ]).getData()[0]

    return {
      id: userData.id,
      username: xss(userData.username),
      first_name: xss(userData.first_name),
      level: userData.level,
      date_joined: userData.date_joined
    }
  }
}

module.exports = UsersService