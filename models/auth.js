const jwt = require('jsonwebtoken');
const config = require('config')
const {User} = require('./user');

/**
 *
 * @param p {object} Object with properties that was assigned when the token was assigned.
 * @property {ObjectId} userId - User unique id.
 * @property {number} exp - Timestamp that represent the token expiration.
 * @function {User} getUser - Get the user document.
 * @constructor
 */
module.exports.Payload = function(p) {
    let _user;
    const self = this;
    this.userId = p.userId;
    this.iat = p.iat;
    this.exp = p.exp;
    this.getUser = _getUser;

    async function _getUser() {
        if (!_user)
            _user = await User.findById(self.userId);
        return _user;
    }
}


/**
 * Generate a token with JsonWebToken module
 * @param {object} payload - The payload to be encrypted
 * @param {string|number} expIn Expiration time.
 */
module.exports.genToken = function (payload, expIn='3m') {
    return jwt.sign(payload, config.get('jwt-secret'), {expiresIn: expIn});
};
