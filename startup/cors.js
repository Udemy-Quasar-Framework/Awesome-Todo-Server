const cors = require('cors')
const config = require('config');
const { debug } = require('./debuggers')

module.exports = (app) => {
  const allowedOrigins = config.get('allowedOrigins') || '';
  const corsOptions = {
    origin: allowedOrigins
  }

  debug('Allowed Origins: ', allowedOrigins)

  app.use(cors(corsOptions))
}
