var snabby = require('./')([ 'eventlisteners' ])
var h = require('snabbdom/h').default
var test = require('tape')

test.skip('vnode', function (t) {
  t.plan(1)

  t.same(
    snabby`<span>Hello world!</span>`,
    h('span', ['Hello world!']),
    'singular'
  )

  // t.same(
  //   snabby`
  //     <div>
  //       <span>Hello</span>
  //       <span>world!<span>(You're awesome)</span></span>
  //     </div>
  //   `,
  //   h('div', [
  //     h('span', ['Hello']),
  //     h('span', [
  //       'world!',
  //       h('span', ['(You\'re awesome)'])
  //     ])
  //   ]),
  //   'nested'
  // )

})

console.log(snabby`
  <span
    contenteditable='true'
    s-hook:insert=${function (e) {}}
  >Hello world</span>
`)
