
module.exports = (router, home) => {
  router.get('', home.index)
  router.get('form', home.getForm)
  router.post('form', home.postForm)

  router.get('log', home.getLog)
  router.get('error', home.error)
}
