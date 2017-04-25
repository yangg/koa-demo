
const post = require('../controllers/post')

module.exports = (router) => {
  router.get('/update/:id?', post.getUpdate)
  router.post('/update/:id?', post.postUpdate)
  router.get('/:id?', post.show)
  router.delete('/:id', post.delete)
}
