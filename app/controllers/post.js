
const db = require('monk')('localhost/koa_blog')
const posts = db.get('posts')

exports.index = async function (ctx) {
  const postList = await posts.find({}, {sort: { created_at: -1 }})
  await ctx.render('index', { posts: postList })
}

exports.getUpdate = async function (ctx) {
  const post = ctx.params.id ? await posts.findOne({ _id: ctx.params.id }) : {}
  await ctx.render('update', { post })
}
exports.postUpdate = async function (ctx) {
  const id = ctx.params.id
  const post = await ctx.request.getBody()
  if (!id) {
    post.created_at = post.updated_at = new Date()
    await posts.insert(post)
  } else {
    post.updated_at = new Date()
    const postInfo = await posts.findOne({ _id: id })
    Object.assign(postInfo, post)
    await posts.update({ _id: id }, postInfo)
    logger.info('Updated post %s', id)
  }
  ctx.flash({type: 'success', msg: `Post ${id ? 'updated' : 'created'} successfully!`})
  ctx.redirect('/')
}
exports.show = async function (ctx) {
  const post = await posts.findOne({ _id: ctx.params.id })
  if (!post) {
    ctx.throw(404, 'Post not found')
  }
  await ctx.render('post', { post })
}
exports.delete = function (ctx) {
  posts.remove({_id: ctx.params.id})
  ctx.flash({type: 'success', msg: 'Post delete successfully!'})
  ctx.body = { code: 0 }
}
