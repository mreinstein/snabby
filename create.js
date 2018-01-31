var snabbdom = require('snabbdom')
var h = require('snabbdom/h').default
var hyperx = require('hyperx')

module.exports = create

function create (modules, options) {
  if (!options) options = {}

  // options
  var directive = options.directive || '@'

  function createElement (sel, input, content) {
    // Adjust content:
    if (content && content.length) {
      if (content.length === 1) {
        content = content[0]
      } else {
        // Flatten nested arrays
        content = [].concat.apply([], content)
      }
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
      if (name.indexOf(directive) === 0) {
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

      // Put all other attributes into `data.attrs`
      else {
        if (!data.attrs) data.attrs = {}
        data.attrs[name] = input[name]
      }
    }

    // Return vnode:
    return h(sel, data, content)
  }

  // Create the snabbdom + hyperx functions
  var patch = snabbdom.init(modules || [])
  
  // Create snabby function
  var snabby = hyperx(createElement, { attrToProp: false })
  
  // Create yo-yo-like update function
  snabby.update = function update (dest, src) {
    return patch(dest, src)
  }

  return snabby
}


