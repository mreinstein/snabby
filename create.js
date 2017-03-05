var snabbdom = require('snabbdom')
var h = require('snabbdom/h').default
var hyperx = require('hyperx')

module.exports = create
create.element = createElement

function create (modules) {
  // Create the snabbdom + hyperx functions
  var patch = snabbdom.init(modules || [])
  var snabby = hyperx(createElement)
  snabby.update = function update (dest, src) {
    return patch(dest, src)
  }

  return snabby
}

function createElement (sel, input, content) {
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

    // Directive attributes
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
    }

    // Shorthand `@on:foo` directive as `:foo`
    else if (name[0] === ':') {
      if (!data.on) data.on = {}
      data.on[name.slice(1)] = input[name]
    }

    // Handle `class` attribute normally:
    else if (name === 'className')
      sel += '.' + input[name]

    // Put all other attributes into `data.attrs`
    else {
      if (!data.attrs) data.attrs = {}
      data.attrs[name] = input[name]
    }
  }

  // Return vnode:
  return h(sel, data, content)
}
