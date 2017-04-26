
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const convert = require('koa-convert')

module.exports = (options, app) => convert(session({
  store: redisStore()
}))
