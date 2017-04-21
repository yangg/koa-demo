
const fundebug = require('fundebug-nodejs')

module.exports = (options, app) => {
  fundebug.config(Object.assign({
    silent: app.env !== 'production',
    releaseStage: app.env
  }, options))
  // uncaughtException is captured by default
  app.on('error', fundebug.KoaErrorHandler)
}
