var snabbdom = require('snabbdom')
var h = require('snabbdom/h').default
var hyperx = require('hyperx')

module.exports = init

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
  var snabby = hyperx(_create)

  // Create update function (like `yo.update`)
  snabby.update = function update (dest, src, opts) {
    if (opts && typeof opts.events !== 'undefined') {
      throw new Error('snabbdom and snabby, unlike yo-yo, init with options')
    }

    return patch(dest, src)
  }

  return snabby
}

function _create (_name, _attrs, _content) {
  var attrs = {}
  var data = { attrs: attrs }

  // Loop through attributes:
  var names = Object.keys(_attrs)
  for (var i = 0, max = names.length; max > i; i++) {
    var name = names[i]

    // Check for attributes with `s-` prefix:
    if (name[0] === 's' && name[1] === '-') {
      // Parse and create object out of the `s-*` directive
      var parts = name.slice(2).split(':')
      var previous = data
      for (var p = 0, max = parts.length, last = max - 1; p < max; p++) {
        var part = parts[p]
        if (p === last) {
          previous[part] = _attrs[name]
        } else if (!previous[part]) {
          previous = previous[part] = {}
        } else {
          previous = previous[part]
        }
      }

    } else {
      // All other attributes go to data.attrs:
      attrs[name] = _attrs[name]
    }
  }

  return h(_name, data, _content)
}
