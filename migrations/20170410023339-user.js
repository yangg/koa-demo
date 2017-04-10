'use strict'

var dbm
var type
var seed

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate
  type = dbm.dataType
  seed = seedLink
}

// https://www.postgresql.org/docs/9.5/static/datatype.html
exports.up = function (db) {
  return db.createTable('users', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    name: 'string',
    uname: { type: 'string', length: 50 },
    height: 'decimal',
    // gender: 'array',
    desc: 'text',
    tags: 'json',
    tags22: 'jsonb',
    created_at: { type: 'timestamp', timezone: true },
    updated_at: { type: 'timestamp', timezone: true },
    deleted_at: { type: 'timestamp', timezone: true }
  })
}

exports.down = function (db) {
  return db.dropTable('users')
}

exports._meta = {
  'version': 1
}
