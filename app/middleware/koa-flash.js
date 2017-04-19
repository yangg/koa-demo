
module.exports = function () {
  return async (ctx, next) => {
    if (ctx.method !== 'GET') {
      ctx.flash = msg => {
        ctx.session.flashMessages = (ctx.session.flashMessages || []).concat(msg)
      }
    } else {
      if (ctx.session.flashMessages) {
        ctx.state.flashMessages = ctx.session.flashMessages
        delete ctx.session.flashMessages
      }
    }
    await next()
  }
}
