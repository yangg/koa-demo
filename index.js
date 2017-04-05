
const Koa = require('koa')
const logger = require('koa-logger')
const router = require('koa-router')()
const render = require('./lib/render')
const parse = require('co-body')

const db = require('monk')('localhost/koa_blog')

const app = new Koa()
app.keys = [ 'secret key' ]
const posts = db.get('posts')

app.use(async (ctx, next) => {
  if (!/\.map$/.test(ctx.path)) {
    await logger()(ctx, next)
  }
})
app.use(render)

app.use(async (ctx, next) => {
  try {
    await next()
    if (ctx.status === 404) {
      ctx.throw('Page not found', 404)
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
  const postList = await posts.find({}, {sort: { created_at: -1 }})
  await ctx.render('index', { posts: postList })
})

router.get('/post/update/:id?', async function (ctx) {
  const post = ctx.params.id ? await posts.findOne({ _id: ctx.params.id }) : {}
  await ctx.render('update', { post })
})
router.post('/post/update/:id?', async function (ctx) {
  const id = ctx.params.id
  const post = await parse(ctx.req)
  if (!id) {
    post.created_at = post.updated_at = new Date()
    await posts.insert(post)
  } else {
    post.updated_at = new Date()
    const postInfo = await posts.findOne({ _id: id })
    Object.assign(postInfo, post)
    await posts.update({ _id: id }, postInfo)
  }
  ctx.redirect('/')
})
router.get('/post/:id?', async function (ctx) {
  const post = await posts.findOne({ _id: ctx.params.id })
  if (!post) {
    ctx.throw('Post not found', 404)
  }
  await ctx.render('post', { post })
})

app.use(router.routes())

app.listen(3000)
