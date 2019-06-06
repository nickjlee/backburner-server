'use strict'

const whitelist = [
  'http://localhost:3000',
  'http://localhost:5000',
  'https://backburner.nickjlee.now.sh'
]

const originGenerator = function(origin, callback) {
  if (whitelist.indexOf(origin) !== -1 || !origin) {
    callback(null, true)
  } else {
    callback(new Error('Not allowed by CORS'))
  }
}

module.exports = originGenerator
