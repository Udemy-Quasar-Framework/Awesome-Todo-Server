const jwt = require('jsonwebtoken')
const config = require('config')
const { User } = require('./userModel')

/**
 *
 * @param p {object} Object with properties that was assigned when the token was assigned.
 * @property {ObjectId} userId - User unique id.
 * @property {number} exp - Timestamp that represent the token expiration.
 * @function {User} getUser - Get the user document.
 * @constructor
 */
module.exports.Payload = function (p) {
  let _user
  const self = this
  self.userId = p.userId
  self.iat = p.iat
  self.exp = p.exp
  self.getUser = _getUser
  self.toPlain = _toPlain

  async function _getUser() {
    if (!_user) _user = await User.findById(self.userId)
    return _user
  }

  function _toPlain() {
    return {
      userId: self.userId,
    }
  }
}

/**
 * Generate a token with JsonWebToken module
 * @param {object} payload - The payload to be encrypted
 * @param {string|number} expIn Expiration time.
 */
module.exports.genToken = function (payload, expIn = '30m') {
  return jwt.sign(payload, config.get('jwt-secret'), { expiresIn: expIn })
}
