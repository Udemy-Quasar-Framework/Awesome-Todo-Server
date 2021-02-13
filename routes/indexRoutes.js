const express = require('express')
const router = express.Router()

const Res = require('../models/ResModel')
const { auth } = require('../middlewares/authMiddleware')
const IndexController = require('../controllers/indexController')

/* GET home page. */
router.get('/index', IndexController.index)

router.get('/auth-rsc1', auth, IndexController.auth_rsc1)

module.exports = router
