var util              = require('util')
var EventEmitter      = require('events').EventEmitter
var AbstractLevelDOWN = require('abstract-leveldown').AbstractLevelDOWN
var Iterator          = require('./iterator')
var CLOSING_ERROR     = new Error('already closing')

module.exports = Down

function Down (leveldown, location) {
  if (!(this instanceof Down)) {
    return new Down(leveldown, location)
  }

  AbstractLevelDOWN.call(this, typeof location == 'string' ? location : '') // optional location, who cares?
  this._db                              = leveldown.apply(null, Array.prototype.slice.call(arguments, 1))
  this._opsTracker                      = trackOps()
}

util.inherits(Down, AbstractLevelDOWN)

Down.prototype._open = function (options, callback) {
  return this._db.open(options, callback)
}

Down.prototype._operation = function (method, args) {
  var callback = args[args.length - 1]
  if (typeof callback === 'function') {
    if (this._closing) {
      return process.nextTick(function () {
        callback(CLOSING_ERROR)
      })
    }

    args[args.length - 1] = this._opsTracker.getCallback(callback)
  } else {
    throw CLOSING_ERROR
  }

  return this._db[method].apply(this._db, args)
}

Down.prototype._approximateSize = function () {
  return this._db.approximateSize.apply(this, arguments)
}

// deferrables
'put get del batch'.split(' ').forEach(function (m) {
  Down.prototype['_' + m] = function () {
    this._operation(m, Array.prototype.slice.call(arguments, 0))
  }
})

Down.prototype._close = function (callback) {
  if (this._opsTracker.pending() > 0) {
    this._closing = true
    return this._opsTracker.once('inactive', this._close.bind(this, callback))
  }

  return this._db.close(callback)
}

Down.prototype._isBuffer = function (obj) {
  return Buffer.isBuffer(obj)
}

Down.prototype._iterator = function () {
  var it = this._db.iterator.apply(this._db, arguments)
  return new Iterator(it, this._opsTracker.getCallback())
}

function trackOps () {
  var pendingOps = 0
  var e = new EventEmitter()
  e.getCallback = function getCallback (callback) {
    pendingOps++
    return function () {
      process.nextTick(function () {
        e.end()
      })

      if (callback) {
        callback.apply(this, arguments)
      }
    }
  }

  e.end = function end () {
    if (--pendingOps === 0) {
      e.emit('inactive')
    }
  }

  e.pending = function pending () {
    return pendingOps
  }

  return e
}
