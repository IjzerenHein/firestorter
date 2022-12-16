
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./firestorter.cjs.production.min.js')
} else {
  module.exports = require('./firestorter.cjs.development.js')
}
