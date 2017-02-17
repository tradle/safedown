
var safedown = require('./leveldown')

module.exports = function makeSafe (leveldown) {
  return safedown.bind(null, leveldown)
}

