const jwt = require('jsonwebtoken')
const config = require('config')

const Res = require('../models/Res')
const { Err } = require('../models/Err')
const { debug } = require('../startup/debuggers')
const { Payload, genToken } = require('../models/auth')
const { User } = require('../models/user')

/**
 * Authorization middleware
 * @param req
 * @param res
 * @param next
 */
module.exports.auth = async (req, res, next) => {
  const token = req.header('X-Auth-Token') || null

  /* no token validation */
  if (!token) {
    debug('Token not provided.')
    res.statusCode = 401
    res.send(
      new Res(false, 'Token not provided', [
        new Err('Token not provided', 'X-Auth-Token', token, 'header'),
      ])
    )
    return
  }

  try {
    const p = await jwt.verify(token, config.get('jwt-secret'))
    const payload = new Payload(p)
    const userId = payload.userId

    /* existing token validation */
    const { lastAuthToken } = await User.findById(userId, '-_id lastAuthToken')

    if (lastAuthToken !== token) {
      debug(
        'Invalid token. The token is JWT valid but is not the last token provided.'
      )
      const errorMsg =
        'Invalid Token. The token is not valid for the current session.'
      res.statusCode = 401
      res.send(
        new Res(false, errorMsg, [
          new Err(errorMsg, 'X-Auth-Token', token, 'header'),
        ])
      )
      return
    }

    /* refresh the token */
    try {
      // TODO Move the genToken to User model
      const newToken = genToken(p)
      await User.updateOne({ _id: userId }, { lastAuthToken: newToken })
    } catch (ex) {
      const errorMsg = 'Error when trying to refresh the token.'
      res.statusCode = 500
      res.send(
        new Res(false, errorMsg, [
          new Err(ex.message, 'unknown', 'unknown', 'unknown'),
        ])
      )
      return
    }

    res.setHeader('X-Auth-Token', token)
    res.locals.payload = payload
    next()
  } catch (e) {
    const errorMsg = 'Token provided not valid. It could be that has expired.'
    res.statusCode = 403
    res.send(
      new Res(false, errorMsg, [
        new Err(e.message, 'X-Auth-Token', token, 'header'),
      ])
    )
  }
}
