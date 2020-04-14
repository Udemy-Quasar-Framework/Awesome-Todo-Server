const indexRouter = require('../routes/index');
const usersRouter = require('../routes/users');

module.exports = function(app) {
    app.use('/', indexRouter);
    app.use('/users', usersRouter);
};
