
const levelup = require('levelup')
// segfault:
// const leveldown = require('leveldown')
// no segfault:
const leveldown = require('./')(require('leveldown'))
const db = levelup('./test.db', { db: leveldown })
const N = 10000
const batch = []
for (var i = 0; i < N; i++) {
  batch.push({ type: 'put', key: i, value: 'a' })
}

db.batch(batch, function (err) {
  if (err) throw err

  db.createReadStream()
    .once('data', function (data) {
      db.close()
    })
})
