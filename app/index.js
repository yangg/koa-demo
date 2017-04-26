
const path = require('path')
const fs = require('fs')
const Router = require('koa-router')

const dependencies = require('../package').dependencies
const middlewareDir = path.join(__dirname, 'middleware')
const pluginDir = path.join(__dirname, 'plugins')
const routesDir = path.join(__dirname, 'routes')
const controllersDir = path.join(__dirname, 'controllers')

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
      const [modulePath, options] = extractPlugin(plugin, pluginDir)
      require(modulePath)(options, app)
    })
  }

  const initRoutes = () => {
    const router = Router()
    fs.readdirSync(routesDir)
    .forEach(function (file) {
      if (file.charAt(0) === '.' || file.slice(-3) !== '.js') {
        return
      }
      const moduleName = path.basename(file, '.js')
      const subRouter = Router({
        prefix: `/${moduleName === 'home' ? '' : moduleName}`
      })
      const controllerPath = path.join(controllersDir, moduleName + '.js')
      const controller = fs.existsSync(controllerPath) ? require(controllerPath) : null

      require(path.join(routesDir, file))(subRouter, controller)
      router.use(subRouter.routes(), subRouter.allowedMethods())
    })
    app.use(router.routes())
  }

  initPlugins()
  initMiddleware()
  initRoutes()
}
