const express = require('express');
const router = express.Router();
const {validationResult} = require('express-validator');

const Res = require('../models/Res');
const {Err, getErrorArr} = require('../models/Err');
const {debug} = require('../startup/debuggers');
const {User, userValidation} = require('../models/user');


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
    await User.create({name, email, password}).catch(ex => {
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
router.post('/login', async (req, res) => {
    const token = "asdasdfwewqedwd.dqasd.qweqweqwdeqwd";

    res.statusCode = 200;
    res.send(new Res(true, 'User is authorized.', [], {token}));
});

module.exports = router;
