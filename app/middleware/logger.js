
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
      handleExceptions: true,
      maxsize: 5 * 1024 * 2024,
      humanReadableUnhandledException: true,
      filename: logPath
    })
  ],
  exitOnError: false
})
global.logger = logger

module.exports = function () {
  return morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', {
    skip: (req, res) => {
      return /\.map$/.test(req.url)
    },
    stream: {
      write: function (msg, encoding) {
        logger.info(msg.replace(/\n$/, ''))
      }
    }
  })
}
