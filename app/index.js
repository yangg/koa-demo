
const path = require('path')

const middlewareDir = path.join(__dirname, 'middleware')
const dependencies = require('../package').dependencies
const initMiddleware = (app) => {
  app.config.middlewares.forEach(middleware => {
    let name
    let options = null
    if (Array.isArray(middleware)) {
      name = middleware[0]
      options = middleware[1]
    } else {
      name = middleware
    }
    let modulePath = dependencies.hasOwnProperty(name) ? name : path.join(middlewareDir, name)
    app.use(require(modulePath)(options, app))
  })
}

module.exports = (app) => {
  const config = require('../config')
  app.config = config
  app.isDev = app.env === 'development'
  app.isProd = app.env === 'production'

  app.keys = app.config.keys
  require('./helper/fundebug')(config.fundebug, app)

  initMiddleware(app)
}
