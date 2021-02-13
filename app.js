const path = require('path')
const logger = require('morgan')
const express = require('express')
const createError = require('http-errors')
const cookieParser = require('cookie-parser')

require('express-async-errors')

const Res = require('./models/ResModel')
const { Err } = require('./models/ErrModel')
const { debug } = require('./startup/debuggers')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

require('./startup/db')()
require('./startup/routes')(app)

// handler 404 requests
app.use(function (req, res, next) {
  debug('404 middleware')
  next(createError(404))
})

// handler unexpected errors
// noinspection JSUnusedLocalSymbols
app.use(function (err, req, res, next) {
  debug('Unhandled error. Error Detail: ', err)

  const errMsg = err && err.message ? err.message : 'Unhandled error.'
  res.statusCode = 500
  res.send(
    new Res(false, 'Unhandled error occurred.', [
      new Err(errMsg, 'unknown', 'unknown', 'unknown'),
    ])
  )
})

module.exports = app
