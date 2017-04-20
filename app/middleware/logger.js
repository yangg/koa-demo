
const logger = require('winston')
const morgan = require('koa-morgan')

const logPath = __dirname + '/../logs/app.log'

logger.configure({
  transports: [
    new logger.transports.Console({
      level: 'debug',
      colorize: true,
      handleExceptions: true
    }),
    new logger.transports.File({
      level: 'info',
      maxsize: 5 * 1024 * 2024,
      handleExceptions: true,
      humanReadableUnhandledException: true,
      filename: logPath
    })
  ],
  exitOnError: false
})
global.logger = logger

module.exports = function () {
  return morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', {
    stream: {
      write: function (msg, encoding) {
        logger.info(msg.trim())
      }
    }
  })
}
