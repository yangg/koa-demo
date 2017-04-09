
const Koa = require('koa')
const logger = require('koa-logger')
const router = require('koa-router')()
const render = require('./lib/render')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')

const app = new Koa()
app.keys = [ 'secret key' ]

const db = require('pg-promise')()({ host: 'localhost', database: 'koa_blog', user: 'brook' })
const tableName = 'post'

app.use(async (ctx, next) => {
  if (!/\.map$/.test(ctx.path)) {
    await logger()(ctx, next)
  }
})
app.use(render)
app.use(bodyParser())
app.use(session(app))
app.use(async (ctx, next) => {
  if (ctx.method !== 'GET') {
    ctx.flash = msg => {
      ctx.session.flashMessages = (ctx.session.flashMessages || []).concat(msg)
    }
  } else {
    if (ctx.session.flashMessages) {
      ctx.state.flashMessages = ctx.session.flashMessages
      delete ctx.session.flashMessages
    }
  }
  await next()
})

app.use(async (ctx, next) => {
  try {
    await next()
    if (ctx.status === 404) {
      ctx.throw(404, 'Page not found')
    }
  } catch (err) {
    let message = err.stack || err.message
    if (err.status !== 404) {
      console.error(err)
    } else {
      message = err.message
    }
    ctx.status = err.status || 500
    await ctx.render('error', { message, status: ctx.status })
  }
})
app.use(async (ctx, next) => {
  const startTime = new Date()
  await next()
  const ms = new Date() - startTime
  ctx.set('X-Response-Time', `${ms}ms`)
})

router.get('/', async function (ctx) {
  const postList = await db.query('SELECT * FROM $1~ ORDER BY id DESC', [tableName])
  await ctx.render('index', { posts: postList })
})

router.get('/post/update/:id?', async function (ctx) {
  const post = ctx.params.id ? await db.oneOrNone('SELECT * FROM $1~ WHERE id=$2', [tableName, ctx.params.id]) : {}
  await ctx.render('update', { post })
})
router.post('/post/update/:id?', async function (ctx) {
  const id = ctx.params.id
  const post = ctx.request.body
  if (!id) {
    post.created_at = post.updated_at = new Date().getTime() / 1000
    await db.query('INSERT INTO post(${this~}) VALUES(${title}, ${body}, ${created_at}, ${updated_at})', post)
  } else {
    post.updated_at = new Date().getTime() / 1000
    await db.query('UPDATE $1~ SET title=$2, body=$3, updated_at=$4 where id=$5',
      [tableName, post.title, post.body, post.updated_at, id])
  }
  ctx.flash({type: 'success', msg: `Post ${id ? 'updated' : 'created'} successfully!`})
  ctx.redirect('/')
})
router.get('/post/:id?', async function (ctx) {
  const post = await db.oneOrNone('SELECT * FROM $1~ WHERE id=$2', [tableName, ctx.params.id])
  if (!post) {
    ctx.throw(404, 'Post not found')
  }
  await ctx.render('post', { post })
})
router.delete('/post/:id', async function (ctx) {
  await db.query('DELETE FROM $1~ where id=$2', [tableName, ctx.params.id])
  ctx.flash({type: 'success', msg: 'Post delete successfully!'})
  ctx.body = { code: 0 }
})

app.use(router.routes())

app.listen(process.env.PORT || 3000)
