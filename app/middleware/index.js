
const fundebug = require('fundebug-nodejs')
const onError = require('./koa-onerror')

const logger = require('./logger')
const render = require('./render')
const getBody = require('koa-get-body')
const session = require('koa-session')
const flash = require('./koa-flash')

module.exports = function (app) {
  fundebug.config({
    apikey: 'e388a44167bf9d7b81924cb1f15ada4afbe472cca1f495ae4604136f9fe92e50',
    silent: app.env !== 'production',
    releaseStage: app.env
  })
  // uncaughtException is captured by default
  app.on('error', fundebug.KoaErrorHandler)
  app.use(onError())

  app.keys = [ 'secret key' ]  // # CONFIG

  app.use(logger())

  app.use(render)
  app.use(getBody({ limits: { fileSize: 1024 * 1024 } })) // # CONFIG
  app.use(session(app))
  app.use(flash())
}
