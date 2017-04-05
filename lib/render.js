
const koaNunjucks = require('koa-nunjucks-2')
const path = require('path')
const nunjucksDate = require('nunjucks-date')

module.exports = koaNunjucks({
  ext: 'html',
  path: path.join(__dirname, '../views/'),
  nunjucksConfig: {
  },
  configureEnvironment: (env) => {
    env.addFilter('dump', function (obj) {
      return JSON.stringify(obj, null, 2)
    })
    // date filter
    nunjucksDate.setDefaultFormat('YYYY-MM-DD H:mm')
    nunjucksDate.install(env)
  }
})
