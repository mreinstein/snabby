var snabbdom = require('snabbdom')
var hyperx = require('hyperx')

module.exports = init

var _create = hyperx(require('snabbdom/h').default)
var _NOOPTS = {}
var _NOMODS = []

function init (modules) {
  mods = mods || _NOMODS

  // Turn plain strings in `mods` into `snabbdom/modules/*`
  for (var i = modules.length; i--;) {
    var _module = modules[i]
    if (typeof _module === 'string') {
      modules[i] = require('snabbdom/modules/' + _module)
    }
  }

  // Create snabbdom patch function
  var patch = snabbdom.init(mods)

  // The template string tag
  var create = _create.bind(create)

  // Update function, like `yo.update`
  create.update = function update (dest, src, opts) {
    if (opts && typeof opts.events !== 'undefined') {
      throw new Error('snabby/snabbdom, unlike yo-yo, inits with options.')
    }

    return patch(dest, src)
  }

  return create
}
