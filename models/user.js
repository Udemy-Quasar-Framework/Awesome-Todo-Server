const {Schema, model} = require('mongoose');
const {check} = require('express-validator');

const userSchema = new Schema({
    name: {
        first: {type: String, require: true, minlength: 2, maxLength: 100},
        last: {type: String, require: true, minlength: 2, maxLength: 100}
    },
    email: {
        type: String,
        require: true,
        unique: true,
        match: /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/
    },
    password: {type: String, require: true}
});

const _userValidation = () => [
    check('name').exists(),
    check('email').exists().matches(/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/, 'i'),
    check('password').exists().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z@#$%^&()_=?!;:<>.,]{8,}$/, 'i')
];

const _userAuthValidation = () => [
    check('email').exists().matches(/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/, 'i'),
    check('password').exists().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z@#$%^&()_=?!;:<>.,]{8,}$/, 'i')
];

module.exports.User = model('user', userSchema);
module.exports.userValidation = _userValidation();
module.exports.userAuthValidation = _userAuthValidation();