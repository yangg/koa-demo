
module.exports = function (ignoreReg) {
  if (!ignoreReg) {
    return null
  }
  return function ignore (ctx, next) {
    if (!ignoreReg.test(ctx.path)) {
      return next()
    }
    // TODO: should return 404 instead of 500
  }
}
