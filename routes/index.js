const express = require('express');
const router = express.Router();

const Res = require('../models/Res');
const {auth} = require('../middlewares/auth');

/* GET home page. */
router.get('/index', function(req, res) {
  res.send(new Res(true, 'Index endpoint working!', [], {}));
});

router.get('/auth-rsc1', auth, async (req, res) => {
  const data = {
    payload: res.locals.payload
  };

  res.statusCode = 200;
  res.send(new Res(true, 'Resource is accessed.', [], data));
});

module.exports = router;
