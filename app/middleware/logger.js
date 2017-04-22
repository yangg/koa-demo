
const logger = require('winston')
const morgan = require('koa-morgan')
const path = require('path')

module.exports = function (options, app) {
  options = Object.assign({
    dir: path.join(__dirname, '/../logs'),
    maxSize: 5 * 1024 * 2024
  })
  const isDebug = process.env.DEBUG

  logger.configure({
    transports: [
      new logger.transports.Console({
        level: isDebug ? 'debug' : 'info',
        colorize: true,
        handleExceptions: true
      }),
      new logger.transports.File({
        level: 'info',
        maxsize: options.maxSize,
        handleExceptions: true,
        humanReadableUnhandledException: true,
        filename: path.join(options.dir, 'app.log')
      })
    ],
    exitOnError: false
  })
  global.logger = logger

  return morgan(app.isDev ? 'dev' : 'combined', {
    stream: {
      write: function (msg, encoding) {
        if (app.isDev) {
          msg = msg.replace(/\u001b\[\d+m/g, '') // strip color in terminal
        }
        logger.info(msg.trim())
      }
    }
  })
}
