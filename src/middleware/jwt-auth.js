const AuthService = require('../auth/auth-service')
const UsersService = require('../users/users-service')

function requireAuth(req, res, next) {
  const authToken = req.get('Authorization') || ''

  let bearerToken

  if(!authToken.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'Missing bearer token' })
  } else {
    bearerToken = authToken.slice(7)
  }

  try {
    const payload = AuthService.verifyJwt(bearerToken)

    UsersService.getByUsername(
      req.app.get('db'),
      payload.sub
    )
      .then(user => {
        if(!user) {
          return res.status(401).json({ error: 'Unauthorized request' })
        }

        req.user = user
        next()
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err)
        next(err)
      })
  } catch(err) {
    res.status(401).json({
      error: 'Unauthorized request'
    })
  }
}

module.exports = {
  requireAuth
}