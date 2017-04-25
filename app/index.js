
const path = require('path')

const middlewareDir = path.join(__dirname, 'middleware')
const pluginDir = path.join(__dirname, 'plugins')
const dependencies = require('../package').dependencies

module.exports = (app) => {
  const config = require('../config')
  app.config = config
  app.isDev = app.env === 'development'
  app.isProd = app.env === 'production'
  app.keys = app.config.keys

  const extractPlugin = (name, pluginDir) => {
    let pluginInfo = name
    if (!Array.isArray(pluginInfo)) {
      pluginInfo = [name]
    }
    if (!dependencies.hasOwnProperty(pluginInfo[0])) {
      pluginInfo[0] = path.join(pluginDir, pluginInfo[0])
    }
    return pluginInfo
  }

  const initMiddleware = () => {
    config.middleware.forEach(middleware => {
      let [modulePath, options] = extractPlugin(middleware, middlewareDir)
      app.use(require(modulePath)(options, app))
    })
  }

  const initPlugins = () => {
    config.plugins.forEach(plugin => {
      let [modulePath, options] = extractPlugin(plugin, pluginDir)
      require(modulePath)(options, app)
    })
  }

  initPlugins()
  initMiddleware()
}
