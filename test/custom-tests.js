'use strict';

var db
var location

module.exports.setUp = function (leveldown, test, testCommon) {
  test('setUp common', testCommon.setUp)
  test('setUp db', function (t) {
    location = testCommon.location()
    db = leveldown(location)
    db.open(t.end.bind(t))
  })
}

module.exports.all = function (leveldown, tape, testCommon) {

  module.exports.setUp(leveldown, tape, testCommon)

  tape('polite close()', function (t) {
    db.put('k1', 'v1', function (err) {
      // 1
      t.notOk(err, 'no error')
      db.del('k1', function (err) {
        // 2
        t.notOk(err, 'no error')
      })

      var iterator = db.iterator()
      iterator.next(function (err, item) {
        // 3
        t.notOk(err, 'no error')
        iterator.end(function (err) {
          t.notOk(err, 'no error')
        })
      })

      db.batch([{ key: 'k2', value: 'v2', type: 'put' }], function (err) {
        // 4
        t.notOk(err, 'no error')
      })

      db.put('k3', 'v3', function (err) {
        // 5
        t.notOk(err, 'no error')
      })

      db.close(function (err) {
        // 6
        t.notOk(err, 'no error')
        var data = []
        db = leveldown(location)
        db.open(function () {
          var iterator = db.iterator({ keyAsBuffer: false, valueAsBuffer: false })
          var data = []
          next()
          db.close(function (err) {
            t.notOk(err, 'no error')
            t.same(data, [
              { key: 'k2', value: 'v2' },
              { key: 'k3', value: 'v3' }
            ])

            t.end()
          })

          db.put('k4', 'v4', function (err) {
            t.ok(err, 'already closing')
          })

          function next () {
            iterator.next(function (err, key, val) {
              t.notOk(err)
              if (key && val) {
                data.push({ key: key, value: val })
                return process.nextTick(next)
              }

              iterator.end(function (err) {
                t.notOk(err, 'no error')
              })
            })
          }
        })
      })
    })
  })
}
