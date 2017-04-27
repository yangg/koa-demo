
const nodemon = require('nodemon')
const browserSync = require('browser-sync').create()

browserSync.init({
  files: ['public/**/*.*'],
  logSnippet: false,
  // reloadDelay: 500,
  notify: false
}, (err, bs) => { // eslint-disable-line
  process.env.BROWSERSYNC_SNIPPET = bs.getOption('snippet')

  nodemon({
    verbose: true,
    restartable: 'rs',
    ext: 'js html',
    stdout: false
  })

  nodemon.on('start', function () {
    // browserSync.reload()
  }).on('stdout', function (msg) {
    const stdout = msg.toString()
    process.stdout.write(stdout)
    if (stdout.indexOf('listen on') > -1) {
      browserSync.reload()
    }
  }).on('quit', function () {
    process.exit()
  })
})
