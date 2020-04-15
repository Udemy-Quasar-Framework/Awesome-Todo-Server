/**
 * Error object to send error information to the client.
 * @param msg {string} Error message
 * @param param {string} parameter that cause the error.
 * @param value {string|number} value of the parameter
 * @param location {string} Where the parameter was located or sent.
 */
function _Err (msg, param, value, location) {
    this.msg = msg || '';
    this.param = param || '';
    this.value = value || '';
    this.location = location || '';
}

/**
 * Generate an array of ErrorRes objects from a ValidationError object. This is usually from mongoose.
 * @param {object} errorObj - Object where each property is an error object with the error information. This object should have the properties (message, , path, value).
 */
function _getErrorArr(errorObj) {
    const errors = [];
    for (const field in errorObj) {
        if (errorObj.hasOwnProperty(field)) {
            const {message, path, value} = errorObj[field];
            errors.push(new _Err(message, path, value, ""));
        }
    }
    return errors;
}

module.exports.Err = _Err;
module.exports.getErrorArr = _getErrorArr;
