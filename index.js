
const Koa = require('koa')
const logger = require('koa-logger')
const router = require('koa-router')()
const render = require('./lib/render')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')
const model = require('./lib/post')

const app = new Koa()
app.keys = [ 'secret key' ]

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
  const postList = await model.find()
  await ctx.render('index', { posts: postList })
})

router.get('/post/update/:id?', async function (ctx) {
  const post = ctx.params.id ? await model.findOne(ctx.params.id) : {}
  await ctx.render('update', { post })
})
router.post('/post/update/:id?', async function (ctx) {
  let id = ctx.params.id
  const post = ctx.request.body
  if (!id) {
    post.created_at = post.updated_at = new Date()
    id = await model.create(post)
  } else {
    post.updated_at = new Date()
    await model.update(id, post)
  }
  ctx.flash({type: 'success', msg: `Post ${id ? 'updated' : 'created'} successfully!`})
  ctx.redirect('/')
})
router.get('/post/:id?', async function (ctx) {
  const post = await model.findOne(ctx.params.id)
  if (!post) {
    ctx.throw(404, 'Post not found')
  }
  await ctx.render('post', { post })
})
router.delete('/post/:id', async function (ctx) {
  await model.delete(ctx.params.id)
  ctx.flash({type: 'success', msg: 'Post delete successfully!'})
  ctx.body = { code: 0 }
})

app.use(router.routes())

app.listen(process.env.PORT || 3000)
