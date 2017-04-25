
const fs = require('fs')
const path = require('path')
const Router = require('koa-router')

const router = Router()
const basename = path.basename(module.filename)

fs.readdirSync(__dirname)
  .forEach(function (file) {
    if (file.indexOf('.') === 0 || file.slice(-3) !== '.js' || file === basename) {
      return
    }
    let moduleName = path.basename(file, '.js')
    let subRouter = Router({
      prefix: `/${moduleName === 'home' ? '' : moduleName}`
    })
    require(path.join(__dirname, file))(subRouter)
    router.use(subRouter.routes(), subRouter.allowedMethods())
  })

module.exports = router
