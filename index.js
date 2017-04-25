
const Koa = require('koa')

const app = new Koa()

require('./app')(app)

const server = app.listen(process.env.PORT || 3009, 'localhost', function () {
  const addressInfo = server.address()
  logger.info('%s(%s) listen on http://%s:%s started', app.config.name, app.env, addressInfo.address, addressInfo.port)
})
