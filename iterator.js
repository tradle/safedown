
module.exports = Iterator

function Iterator (iterator, onend) {
  this._iterator = iterator
  this._onend = onend
}

Iterator.prototype.next = function (cb) {
  this._iterator.next(cb)
}

Iterator.prototype.end = function (cb) {
  var self = this
  if (!cb) throw new Error('end() expects a callback')

  this._iterator.end(function (err) {
    try {
      cb(err)
    } finally {
      self._onend()
    }
  })
}
