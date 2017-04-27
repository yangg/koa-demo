
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
  }).on('stdout', function (stdout) {
    process.stdout.write(stdout)
    if (stdout.toString().indexOf('listen on') > -1) {
      browserSync.reload()
    }
  }).on('stderr', (err) => process.stderr.write(err))
  .on('quit', function () {
    process.exit()
  })
})
