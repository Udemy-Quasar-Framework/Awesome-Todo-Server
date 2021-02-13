module.exports = function(success, msg, errors, data) {
    this.success = success === null || typeof success === 'undefined' ? true : success;
    this.msg = msg || 'Success';
    this.errors = errors || [];
    this.data = data || {};
};
