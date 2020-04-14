const express = require('express');
const router = express.Router();
const Res = require('../models/Res');

/* GET users listing. */
router.get('/', function(req, res) {
  res.send(new Res(true, 'Users index endpoint working!'));
});

module.exports = router;
