var snabbdom = require('snabbdom')
var h = require('snabbdom/h').default
var hyperx = require('hyperx')

var defModules = {
  class: require('snabbdom/modules/class').default,
  props: require('snabbdom/modules/props').default,
  style: require('snabbdom/modules/style').default,
  attributes: require('snabbdom/modules/attributes').default,
  eventlisteners: require('snabbdom/modules/eventlisteners').default
}

module.exports = init

function init (modules) {
  if (modules) {
    // Plain strings into `snabbdom/modules/*`:
    for (var i = modules.length; i--;) {
      var _module = modules[i]
      if (typeof _module === 'string') {
        modules[i] = defModules[_module]
      }
    }
  }

  // Create snabbdom patch function
  var patch = snabbdom.init(modules || [])

  // Create template tag function
  var snabby = hyperx(_create)

  // Create update function (like `yo.update`)
  snabby.update = function update (dest, src) {
    return patch(dest, src)
  }

  return snabby
}

function _create (sel, input, content) {
  // Adjust content:
  if (content && content.length === 1) {
    content = content[0]
  }

  // Attribute names, and handling none faster:
  var names = Object.keys(input)
  if (!names || !names.length) {
    return h(sel, content)
  }

  // Parse Snabbdom's `data` from attributes:
  var data = {}
  for (var i = 0, max = names.length; max > i; i++) {
    var name = names[i]
    if (name[0] === '@') {
      var parts = name.slice(1).split(':')
      var previous = data
      for (var p = 0, pmax = parts.length, last = pmax - 1; p < pmax; p++) {
        var part = parts[p]
        if (p === last) {
          previous[part] = input[name]
        } else if (!previous[part]) {
          previous = previous[part] = {}
        } else {
          previous = previous[part]
        }
      }
    } else if (name[0] === ':') {
      if (!data.on) data.on = {}
      data.on[name.slice(1)] = input[name]
    } else {
      if (!data.attrs) data.attrs = {}
      data.attrs[name] = input[name]
    }
  }

  // Return vnode:
  return h(sel, data, content)
}
