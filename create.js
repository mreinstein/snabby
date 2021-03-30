import { init, thunk, h } from 'snabbdom';
import hyperx             from 'hyperx'


export default function create (modules, options={}) {

  const directive = options.directive || '@'

  function createElement (sel, input, content) {
    if (sel === '!--')
      return h('!', input.comment)

    if (content && content.length) {
      if (content.length === 1)
        content = content[0]
      else
        content = [].concat.apply([], content)  // flatten nested arrays
    }

    // attribute names, and handling none faster:
    const names = Object.keys(input)
    if (!names || !names.length)
      return h(sel, content)

    // parse Snabbdom's `data` from attributes:
    const data = { }
    for (let i = 0, max = names.length; max > i; i++) {
      const name = names[i]
      if (input[name] === 'false')
        input[name] = false

      // directive attributes
      if (name.indexOf(directive) === 0) {
        const parts = name.slice(1).split(':')
        let previous = data
        for (let p = 0, pmax = parts.length, last = pmax - 1; p < pmax; p++) {
          const part = parts[p]
          if (p === last)
            previous[part] = input[name]
          else if (!previous[part])
            previous = previous[part] = { }
          else
            previous = previous[part]
        }
      }

      // put all other attributes into `data.attrs`
      else {
        if (!data.attrs)
          data.attrs = { }
        data.attrs[name] = input[name]
      }
    }

    // return vnode:
    return h(sel, data, content)
  }

  // create the snabbdom + hyperx functions
  const patch = init(modules || [ ])
  
  // create snabby function
  const snabby = hyperx(createElement, { comments: true, attrToProp: false })
  
  // create yo-yo-like update function
  snabby.update = function update (dest, src) {
    return patch(dest, src)
  }

  snabby.thunk = thunk

  return snabby
}
