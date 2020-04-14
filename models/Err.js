/**
 * Error object to send error information to the client.
 * @param msg {string} Error message
 * @param param {string} parameter that cause the error.
 * @param value {string|number} value of the parameter
 * @param location {string} Where the parameter was located or sent.
 */
module.exports = function(msg, param, value, location) {
    this.msg = msg || '';
    this.param = param || '';
    this.value = value || '';
    this.location = location || '';
};
