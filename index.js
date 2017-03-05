// Inits with common modules out of the box
// Also easier to use across multiple files
module.exports = require('./create')([
  require('snabbdom/modules/attributes').default,
  require('snabbdom/modules/eventlisteners').default,
  require('snabbdom/modules/class').default,
  require('snabbdom/modules/props').default,
  require('snabbdom/modules/style').default
])
