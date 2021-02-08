const Res = require('../models/Res')

module.exports.index = function (req, res) {
  res.send(new Res(true, 'Index endpoint working!', [], {}))
}

module.exports.auth_rsc1 = async (req, res) => {
  const data = {
    payload: res.locals.payload,
  }

  res.statusCode = 200
  res.send(new Res(true, 'Resource is accessed.', [], data))
}
