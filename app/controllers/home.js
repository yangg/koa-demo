
exports.index = require('./post').index

exports.error = async function (ctx) {
  throw new Error('NewError')
}

exports.getForm = async function (ctx) {
  await ctx.render('form')
}
exports.postForm = async function (ctx) {
  const body = await ctx.request.getBody()
  body.__contentType = ctx.request.type
  ctx.body = body
}

exports.getLog = async function (ctx) {
  const options = Object.assign({
    // from: new Date() - 24 * 60 * 60 * 1000,
    // until: new Date(),
    // order: 'desc',
    // start: 0
    limit: 200
    // fields: ['level', 'message', 'timestamp', 'stack']
  }, ctx.query)
  await new Promise((resolve) => {
    logger.query(options, (err, results) => {
      ctx.body = results
      resolve()
    })
  })
}
