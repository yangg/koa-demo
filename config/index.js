
// const path = require('path')
const appPackage = require('../package')
module.exports = {
  name: appPackage.name,
  keys: [ 'secret key' ],
  middleware: [
    ['ignore', /\.map$/],
    'koa-onerror',
    'logger',
    // 'koa-session',
    'session',
    'koa-flash',
    'render',
    ['koa-get-body', { limits: { fileSize: 1024 * 1024 } }]
  ],

  plugins: [
    [ 'fundebug', {
      apikey: 'e388a44167bf9d7b81924cb1f15ada4afbe472cca1f495ae4604136f9fe92e50'
    } ]
  ]
}
