var snabbdom = require('snabbdom')
var hyperx = require('hyperx')

module.exports = init

var _create = hyperx(require('snabbdom/h').default)

function init (modules) {
  if (modules) {
    // Plain strings into `snabbdom/modules/*`:
    for (var i = modules.length; i--;) {
      var _module = modules[i]
      if (typeof _module === 'string') {
        modules[i] = require('snabbdom/modules/' + _module)
      }
    }
  }

  // Create snabbdom patch function
  var patch = snabbdom.init(modules || [])

  // Create template tag function
  var snabby = _create.bind(null)

  // Create update function (like `yo.update`)
  snabby.update = function update (dest, src, opts) {
    if (opts && typeof opts.events !== 'undefined') {
      throw new Error('snabbdom and snabby, unlike yo-yo, init with options')
    }

    return patch(dest, src)
  }

  return snabby
}
