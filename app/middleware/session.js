
const session = require('koa-generic-session')
const redisStore = require('koa-redis')

module.exports = (options, app) => session({
  store: redisStore()
})
