
const http = require('http')

function onError () {
  return async (ctx, next) => {
    try {
      await next()
      if (ctx.status === 404) {
        ctx.throw(404, 'Page not found')
      }
    } catch (err) {
      if (typeof err.status !== 'number' || !http.STATUS_CODES[err.status]) {
        err.status = 500
      }
      const errObj = { status: err.status, error: err.message }
      if (ctx.app.env !== 'production') {
        // Print stack in non-production
        if (err.stack && err.status !== 404) {
          errObj.error = err.stack
          console.error(err)
        }
      }
      ctx.status = err.status
      const acceptType = ctx.accepts('html', 'json')
      switch (acceptType) {
        case 'json':
          ctx.body = errObj
          break
        default:
          await ctx.render('error', errObj)
          break
      }
    }
  }
}

module.exports = onError
