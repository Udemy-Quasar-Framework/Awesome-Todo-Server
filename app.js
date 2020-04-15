const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

require('express-async-errors');

const Res = require('./models/Res');
const Err = require('./models/Err');
const {debug} = require('./startup/debuggers');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./startup/db')();
require('./startup/routes')(app);

// handler 404 requests
app.use(function(req, res, next) {
    res.send(new Res(false, '404 - Resource not found.', [
        new Err('Resource not found', 'unknown', 'unknown', 'unknown')
    ]));
});

// handler unexpected errors
app.use(function(err, req, res, next) {
    debug('Unhandled error. Error Detail: ', err);

    const errMsg = err && err.message ? err.message : 'Unhandled error.'
    res.statusCode = 500;
    res.send(new Res(false, 'Unhandled error occurred.', [
        new Err(errMsg, 'unknown', 'unknown', 'unknown')
    ]));
});

module.exports = app;
