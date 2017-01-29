var snabby = require('./')()
var h = require('snabbdom/h').default
var test = require('tape')

test('vnode', function (t) {
  t.plan(2)

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
