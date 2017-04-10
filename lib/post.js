
const pgp = require('pg-promise')
const db = pgp()({ host: 'localhost', database: 'koa_blog', user: 'brook' })

// pg-promise Learn by Example
// https://github.com/vitaly-t/pg-promise/wiki/Learn-by-Example

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
  constructor () {
    this.tableName = this.constructor.name.toLowerCase() + 's'
  }
  find () {
    return db.query('SELECT * FROM $1~ ORDER BY id DESC', [this.tableName])
  }
  findOne (id) {
    return db.oneOrNone('SELECT * FROM $1~ WHERE id=$2', [this.tableName, id])
  }
  create (model) {
    return db.one(`INSERT INTO ${this.tableName}($[this~]) VALUES($[title], $[body], $[created_at], $[updated_at]) returning id`, model)
      .then(data => data.id)
  }
  update (id, model) {
    return db.none('UPDATE $1~ SET $2 where id=$3',
      [this.tableName, new SetValues(model), id])
  }
  delete (id) {
    return db.result('DELETE FROM $1~ where id=$2', [this.tableName, id])
  }
}

module.exports = new Post()
