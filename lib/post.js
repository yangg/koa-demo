
const pgp = require('pg-promise')
const db = pgp()({ host: 'localhost', database: 'koa_blog', user: 'brook' })
const tableName = 'post'

// sets all the object's properties as they are;
function SetValues (obj) {
  this.obj = obj
  this._rawDBType = true // raw-text output override;
  this.formatDBType = function () {
    var props = Object.keys(this.obj)
    var s = props.map(function (m) {
      return m + '=${' + m + '}' // creating the formatting parameters;
    })
    return pgp.as.format(s.join(', '), this.obj) // returning the formatted string;
  }
}

class Post {
  find () {
    return db.query('SELECT * FROM $1~ ORDER BY id DESC', [tableName])
  }
  findOne (id) {
    return db.oneOrNone('SELECT * FROM $1~ WHERE id=$2', [tableName, id])
  }
  create (model) {
    return db.one('INSERT INTO post($[this~]) VALUES($[title], $[body], $[created_at], $[updated_at]) returning id', model)
      .then(data => data.id)
  }
  update (id, model) {
    return db.query('UPDATE $1~ SET $2 where id=$3',
      [tableName, new SetValues(model), id])
  }
  delete (id) {
    return db.query('DELETE FROM $1~ where id=$2', [tableName, id])
  }
}

module.exports = new Post()
