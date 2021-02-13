const indexRouter = require('../routes/indexRoutes');
const authRouter = require('../routes/authRoutes');

module.exports = function(app) {
    app.use('/', indexRouter);
    app.use('/api/auth', authRouter);
};
