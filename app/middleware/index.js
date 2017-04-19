
const fundebug = require('fundebug-nodejs')
const onError = require('./koa-onerror')

const logger = require('koa-logger')
const render = require('./render')
const getBody = require('koa-get-body')
const session = require('koa-session')
const flash = require('./koa-flash')

module.exports = function (app) {
  fundebug.config({
    apikey: 'e388a44167bf9d7b81924cb1f15ada4afbe472cca1f495ae4604136f9fe92e50',
    silent: app.env !== 'development',
    releaseStage: app.env
  })
  // fundebug.notify('Test', 'Hello, Fundebug!')
  app.on('error', fundebug.KoaErrorHandler)
  process.on('uncaughtException', function (ex) {
    fundebug.notifyError(ex)
  })
  app.use(onError())

  app.keys = [ 'secret key' ]

  app.use(async (ctx, next) => {
    if (!/\.map$/.test(ctx.path)) {
      await logger()(ctx, next)
    }
  })
  app.use(render)
  app.use(getBody({ limits: { fileSize: 1024 * 1024 } }))
  app.use(session(app))
  app.use(flash())
  app.use(async (ctx, next) => {
    const startTime = new Date()
    await next()
    const ms = new Date() - startTime
    ctx.set('X-Response-Time', `${ms}ms`)
  })
}
