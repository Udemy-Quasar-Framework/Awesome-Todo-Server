const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const moment = require('moment')

const { debug } = require('../startup/debuggers')
const { genToken } = require('../models/authModel')
const Res = require('../models/ResModel')
const { Err, getErrorArr } = require('../models/ErrModel')
const { User, UserC } = require('../models/userModel')

module.exports.register = async (req, res) => {
  let errors = null
  const { name, email, password } = req.body

  // throw new Error('My Error');

  /* validate body data */
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    debug('Model errors: ', errors)
    res.statusCode = 400
    res.send(
      new Res(
        false,
        'Request body not valid.',
        errors.array({ onlyFirstError: false })
      )
    )
    return
  }

  /* validate user email is unique */
  const exists = await User.exists({ email })
  if (exists) {
    res.statusCode = 400
    res.send(
      new Res(false, 'Email already in use.', [
        new Err('Email already in use by other user.', 'email', email, 'body'),
      ])
    )
    return
  }

  /* create the new user */
  errors = null
  const passwordHash = await bcrypt.hash(password, 10) // more than 10 breaks the method
  await User.create(new UserC(name, email, passwordHash)).catch((ex) => {
    debug('Error saving your changes.')
    errors = getErrorArr(ex.errors)
  })
  if (errors) {
    res.statusCode = 500
    res.send(new Res(false, 'Error saving your changes.', errors))
    return
  }

  res.statusCode = 200
  res.send(new Res(true, 'User registered', [], { name, email }))
}

module.exports.login = async (req, res) => {
  let errors = null
  const { email, password } = req.body
  let errorMsg = 'Email or password not valid.'
  const credentialError = new Err(errorMsg, 'email, password', email, 'body')

  /* validate body data */
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    debug('Model errors: ', errors)
    res.statusCode = 400
    res.send(
      new Res(
        false,
        'Request body not valid.',
        errors.array({ onlyFirstError: false })
      )
    )
    return
  }

  /* validate user */
  const user = await User.findOne({ email })
  if (!user) {
    debug(`User with email ${email} not found.`)
    res.statusCode = 400
    res.send(new Res(false, errorMsg, [credentialError]))
    return
  }

  /* validate password */
  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword) {
    debug(`The password ${password} is not valid.`)
    res.statusCode = 400
    res.send(new Res(false, errorMsg, [credentialError]))
    return
  }

  // Everything fine, authenticate the user
  const payload = { userId: user._id }
  const token = genToken(payload, '3m')
  const data = {
    token,
    exp: moment().add(3, 'minutes'),
  }

  /* update the token with the new refresh token */
  errors = null
  user.lastAuthToken = token
  await user.save().catch((ex) => {
    debug(`Error when try to save the refresh token with value ${token}.`)
    errorMsg = 'Error when trying to refresh the token.'
    errors = [new Err(ex.message, 'unknown', 'unknown', 'unknown')]
  })
  if (errors) {
    res.statusCode = 500
    res.send(new Res(false, errorMsg, errors))
    return
  }

  res.setHeader('X-Auth-Token', token)
  res.statusCode = 200
  res.send(new Res(true, 'User is authorized.', [], data))
}
