
const fs = require('fs')

module.exports = (router, home) => {
  router.get('', home.index)
  router.get('form', home.getForm)
  router.post('form', home.postForm)

  router.all('upload', (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', ctx.get('Origin'))
    ctx.set('Access-Control-Allow-Headers', ctx.get('Access-Control-Request-Headers'))
    return next()
  })
  router.post('upload', home.upload)
  router.get('upload/:id?', async (ctx, next) => {
    ctx.type = 'image/png'
    ctx.body = fs.readFileSync(__dirname + '/../../upload/' + ctx.params.id)
  })

  router.get('log', home.getLog)
  router.get('error', home.error)
}
