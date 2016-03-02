const Uniqush = require('./lib/uniqush')

module.exports = function (endpoint) {
  return new Uniqush(endpoint)
}
