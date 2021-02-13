const express = require('express')
const router = express.Router()

const { userValidation, userAuthValidation } = require('../models/user')
const authController = require('../controllers/authController')

/**
 * Register a new user. After register will be able to access resources that are protected.
 */
router.post('/register', userValidation, authController.register)

/**
 * Login or authenticate a user. Will validate credentials and return a JWT token.
 */
router.post('/login', userAuthValidation, authController.login)

module.exports = router
