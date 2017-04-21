
const path = require('path')

// eslint-disable-next-line no-extend-native
String.prototype.join = function () {
  return path.apply(null, this, arguments)
}
