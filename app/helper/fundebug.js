
module.exports = (options, app) => {
  // dont's use fundebug config silent, will cause uncaughtException silent
  if (!app.isEnv) {
    return
  }
  const fundebug = require('fundebug-nodejs')
  fundebug.config(Object.assign({
    releaseStage: app.env
  }, options))
  // uncaughtException is captured by default
  app.on('error', fundebug.KoaErrorHandler)
}
