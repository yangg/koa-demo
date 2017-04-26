
module.exports = (router, post) => {
  router.get('/update/:id?', post.getUpdate)
  router.post('/update/:id?', post.postUpdate)
  router.get('/:id?', post.show)
  router.delete('/:id', post.delete)
}
