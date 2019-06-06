const xss = require('xss')
const bcrypt = require('bcryptjs')
const Treeize = require('treeize')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
  getUserByUsername(db, username) {
    return db
      .from('backburner_users')
      .where({ username })
      .first()
  },

  hasUserWithUserName(db, username) {
    return db
      .from('backburner_users')
      .where({ username })
      .first()
      .then(user => !!user)
  },

  insertNewUser(db, newUser) {
    return db
      .insert(newUser)
      .into('backburner_users')
      .returning('*')
      .then(([user]) => user)
  },

  validatePassword(password) {
    if (password.length < 8) {
      return 'Password must be longer than 8 characters'
    }

    if (password.length > 72) {
      return 'Password should be less than 72 characters'
    }

    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty space'
    }

    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain 1 Uppercase, 1 Lowercase, 1 Number, and 1 Special Character'
    }

    return null
  },

  hashPassword(password) {
    return bcrypt.hash(password, 12)
  },

  serializeUser(user) {
    const userTree = new Treeize()

    const userData = userTree.grow([user]).getData()[0]

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
