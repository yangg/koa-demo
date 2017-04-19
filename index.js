
const Koa = require('koa')
const router = require('koa-router')()

const db = require('monk')('localhost/koa_blog')
const posts = db.get('posts')

const app = new Koa()

require('./app/middleware')(app)

router.get('/', async function (ctx) {
  const postList = await posts.find({}, {sort: { created_at: -1 }})
  // console.log(ctx.session.flashMessages)
  await ctx.render('index', { posts: postList })
})

router.get('/post/update/:id?', async function (ctx) {
  const post = ctx.params.id ? await posts.findOne({ _id: ctx.params.id }) : {}
  await ctx.render('update', { post })
})
router.post('/post/update/:id?', async function (ctx) {
  const id = ctx.params.id
  const post = ctx.request.body
  if (!id) {
    post.created_at = post.updated_at = new Date()
    await posts.insert(post)
  } else {
    post.updated_at = new Date()
    const postInfo = await posts.findOne({ _id: id })
    Object.assign(postInfo, post)
    await posts.update({ _id: id }, postInfo)
  }
  ctx.flash({type: 'success', msg: `Post ${id ? 'updated' : 'created'} successfully!`})
  ctx.redirect('/')
})
router.get('/post/:id?', async function (ctx) {
  const post = await posts.findOne({ _id: ctx.params.id })
  if (!post) {
    ctx.throw(404, 'Post not found')
  }
  await ctx.render('post', { post })
})
router.delete('/post/:id', function (ctx) {
  posts.remove({_id: ctx.params.id})
  ctx.flash({type: 'success', msg: 'Post delete successfully!'})
  ctx.body = { code: 0 }
})

router.get('/error', async function (ctx) {
  throw new Error('NewError')
})
router.get('/form', async function (ctx) {
  await ctx.render('form')
})
router.post('/form', async function (ctx) {
  const body = await ctx.request.getBody()
  body.__contentType = ctx.request.type
  ctx.body = body
})

app.use(router.routes())

app.listen(process.env.PORT || 3009)
