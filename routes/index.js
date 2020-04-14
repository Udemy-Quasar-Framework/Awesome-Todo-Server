const express = require('express');
const router = express.Router();
const Res = require('../models/Res');

/* GET home page. */
router.get('/index', function(req, res) {
  res.send(new Res(true, 'Index endpoint working!', [], {}));
});

module.exports = router;
