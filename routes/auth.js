const express = require('express');
const router = express.Router();
const {validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

const Res = require('../models/Res');
const {Err, getErrorArr} = require('../models/Err');
const {debug} = require('../startup/debuggers');
const {User, UserC, userValidation, userAuthValidation} = require('../models/user');


/**
 * Register a new user. After register will be able to access resources that are protected.
 */
router.post('/register', userValidation, async (req, res) => {
    let errors = null;
    const {name, email, password} = req.body;

    // throw new Error('My Error');

    /* validate body data */
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        debug('Model errors: ', errors);
        res.statusCode = 400;
        res.send(new Res(false, 'Request body not valid.', errors.array({onlyFirstError: false})));
        return;
    }

    /* validate user email is unique */
    const exists = await User.exists({email});
    if (exists) {
        res.statusCode = 400;
        res.send(new Res(false, 'Email already in use.', [
            new Err('Email already in use by other user.', 'email', email, 'body')
        ]));
        return;
    }

    /* create the new user */
    errors = null;
    const passwordHash = await bcrypt.hash(password, 10); // more than 10 breaks the method
    await User.create(new UserC(name, email, passwordHash)).catch(ex => {
        debug('Error saving your changes.');
        errors = getErrorArr(ex.errors);
    });
    if (errors) {
        res.statusCode = 500;
        res.send(new Res(false, 'Error saving your changes.', errors));
        return;
    }

    res.statusCode = 200;
    res.send(new Res(true, 'User registered', [], {name, email}));
});


/**
 * Login or authenticate a user. Will validate credentials and return a JWT token.
 */
router.post('/login', userAuthValidation, async (req, res) => {
    let errors = null;
    const {email, password} = req.body;
    const errorMsg = 'Email or password not valid.';
    const credentialError = new Err(errorMsg, 'email, password', email, 'body');

    /* validate body data */
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        debug('Model errors: ', errors);
        res.statusCode = 400;
        res.send(new Res(false, 'Request body not valid.', errors.array({onlyFirstError: false})));
        return;
    }

    /* validate user */
    const user = await User.findOne({email});
    if (!user) {
        debug(`User with email ${email} not found.`);
        res.statusCode = 400;
        res.send(new Res(false, errorMsg, [credentialError]));
        return;
    }

    /* validate password */
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        debug(`The password ${password} is not valid.`);
        res.statusCode = 400;
        res.send(new Res(false, errorMsg, errors));
        return;
    }

    // Everything fine, authenticate the user
    const payload = {userId: user._id};
    const data = {
        token: jwt.sign(payload, config.get('jwt-secret'), {expiresIn: '1h'})
    };

    res.statusCode = 200;
    res.send(new Res(true, 'User is authorized.', [], data));
});

module.exports = router;
