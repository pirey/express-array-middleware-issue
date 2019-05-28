const express = require('express')
const expressJwt = require('express-jwt')
const jwt = require('jsonwebtoken')

const jwtSecret = 'secret'

const app = express()

// this uses the middleware WITHOUT err param
const authMiddlewareWork = [expressJwt({secret: jwtSecret}), jwtHandler]

// this uses the middleware WITH err param
const authMiddlewareNotWork = [
  expressJwt({secret: jwtSecret}),
  jwtWithErrorHandler,
]

app.use(express.json())

// outputs testing token
// call this route first to get token to use the /work and /not_work route
app.get('/', function(_, res) {
  const token = jwt.sign({userId: 1}, jwtSecret)

  res.json({token})
})

app.get('/work', authMiddlewareWork, function(req, res) {
  res.json({customer: req.customer})
})

app.get('/not_work', authMiddlewareNotWork, function(req, res) {
  res.json({customer: req.customer})
})

module.exports = app

// simple middleware to set req.customer
function jwtWithErrorHandler(err, req, res, next) {
  console.log('hello, is this called?')
  console.log('why is this not called?')

  if (err.name === 'UnauthorizedError') {
    return res.status(401).send('invalid token...')
  }

  // get customer from db somehow
  req.customer = {id: req.user.userId, name: 'john'}
  next()
}

// simple middleware to set req.customer
function jwtHandler(req, res, next) {
  console.log('this gets called')

  // get customer from db somehow
  req.customer = {id: req.user.userId, name: 'john'}
  next()
}
