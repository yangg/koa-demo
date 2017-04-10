
const Sequelize = require('sequelize')
const sequelize = new Sequelize('postgresql://brook@localhost:5432/koa_blog', {
  define: {
    timestamps: false,
    underscored: true
  }
})

const Post = sequelize.define('post', {
  title: {
    type: Sequelize.STRING,
    comment: '标题'
  },
  body: {
    type: Sequelize.TEXT,
    comment: '内容'
  }
}, {
  timestamps: true,
  paranoid: true
})
Post.sync()

module.exports = Post
