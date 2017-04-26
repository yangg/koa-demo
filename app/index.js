
const path = require('path')
const fs = require('fs')
const merge = require('lodash.merge')
const Router = require('koa-router')

const dependencies = require('../package').dependencies
const configDir = path.join(__dirname, '../config')
const middlewareDir = path.join(__dirname, 'middleware')
const pluginDir = path.join(__dirname, 'plugins')
const routesDir = path.join(__dirname, 'routes')
const controllersDir = path.join(__dirname, 'controllers')

const extendConfig = (config, name) => {
  const configName = path.join(configDir, name)
  try {
    let currentConfig = require(configName)
    if (typeof currentConfig === 'function') {
      currentConfig = currentConfig(config)
    }
    merge(config, currentConfig)
  } catch (ex) {
    console.warn(ex.message)
  }
}

module.exports = (app) => {
  let config = {
    env: app.env,
    extendConfigs: ['[env]']
  }
  extendConfig(config, 'default')
  config.extendConfigs.forEach(c =>
    extendConfig(config, c.replace('[env]', app.env))
  )

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
