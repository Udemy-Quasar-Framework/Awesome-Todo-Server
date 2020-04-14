module.exports = function(success, msg, errors, data) {
    this.success = success || true;
    this.msg = msg || 'Success';
    this.errors = errors || [];
    this.data = data || {};
};
