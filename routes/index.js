const express = require('express');
const router = express.Router();
const Res = require('../models/Res');

/* GET home page. */
router.get('/index', function(req, res) {
  res.send(new Res(true, 'Index endpoint working!', [], {}));
});

router.get('auth-rsc1', async (req, res) => {

  res.statusCode = 200;
  res.send(new Res(true, 'Resource is accessed.', [], {}));
});

module.exports = router;
