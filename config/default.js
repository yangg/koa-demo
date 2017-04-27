
const path = require('path')

const nunjucksDate = require('nunjucks-date')
const viewNunjucks = {
  ext: 'html',
  path: path.join(__dirname, '../views/'),
  nunjucksConfig: { },
  configureEnvironment: (env) => {
        // date filter
    nunjucksDate.setDefaultFormat('YYYY-MM-DD H:mm')
    nunjucksDate.install(env)
  }
}

const appPackage = require('../package')
module.exports = {
  name: appPackage.name,
  keys: [ 'secret key' ],
  middleware: [
    [ 'ignore', /\.map$/ ],
    'koa-onerror',
    'logger',
    // 'koa-session',
    'session',
    'koa-flash',
    [ 'koa-nunjucks-2', viewNunjucks ],
    [ 'koa-get-body', { limits: { fileSize: 1024 * 1024 } } ]
  ],
  plugins: [
    [ 'fundebug', {
      apikey: 'e388a44167bf9d7b81924cb1f15ada4afbe472cca1f495ae4604136f9fe92e50'
    } ]
  ]
}
