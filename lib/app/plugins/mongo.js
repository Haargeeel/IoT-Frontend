var mongodb = require('mongodb')
  , config = require('./config')

var Db = mongodb.Db
  , Server = mongodb.Server
  , ReplSetServers = mongodb.ReplSetServers

var servers = config.mongo.servers

var me = module.exports = {}

var init = function(cb) {
  var _dbs = {}
    , cbCalled = false
  config.mongo.dbs.forEach(function (dbName) {
    var replSet = new ReplSetServers(
      [ new Server(servers[0].addr, servers[0].port)
      , new Server(servers[1].addr, servers[1].port)
      , new Server(servers[2].addr, servers[2].port)]
    ,
      { rs_name: 'rs0'
      , readPreference: 'nearest'})

    new Db(dbName, replSet, {safe:true}).open(function (err, dbc) {
      if (err && !cbCalled) {
        cbCalled = true
        cb(err)
      }
      _dbs[dbName] = dbc;
      if (Object.keys(_dbs).length === config.mongo.dbs.length && !cbCalled) {
        cb(err, _dbs)
      }
    })
  })
}

var dbs;

me.get = function (dbName, cb) {
  if (dbs) return cb(null, dbs[dbName])

  init(function (err, _dbs) {
    if (err) return cb(err)
    dbs = _dbs
    cb(null, dbs[dbName])
  })
}
