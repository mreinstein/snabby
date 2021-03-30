import browserEnv from 'browser-env'
import snabby     from './index.js'
import { h }      from 'snabbdom' // helper function for creating vnodes
import test       from 'tape'


browserEnv()


test('creation', function (t) {
  t.plan(2)

  t.same(
    snabby`<span>Hello world!</span>`,
    h('span', 'Hello world!'),
    'span node'
  )

  t.same(
    snabby`<div><span>Hello</span><span>world!<span>(You're awesome)</span></span></div>`,
    h('div', [ h('span', 'Hello'), h('span', [ 'world!', h('span', '(You\'re awesome)') ]) ]),
    'nested nodes'
  )
})


test('event listeners', function (t) {
  t.plan(2)

  function sample () {}
  function sample2 () {}

  t.same(
    snabby`<span @on:click=${sample}>Hello world</span>`.data.on,
    { click: sample },
    'single listener'
  )

  t.same(
    snabby`<span @on:click=${sample} @on:input=${sample2}></span>`.data.on,
    { click: sample, input: sample2 },
    'multiple listeners'
  )

 // t.same(
 //   snabby`<span :click=${sample} :keydown=${sample2}>`.data.on,
 //   { click: sample, keydown: sample2 },
 //   'shorthand listeners'
 // )
})


test('class attribute', function (t) {
  t.plan(1)

  console.log(snabby`<span class='foo'></span>`)

 t.is(
    snabby`<span class='foo'>Hello world</span>`.data.attrs.class,
    'foo',
    'adds class selector'
  )
})


test('non-string attribute value', function (t) {
  t.plan(1)
  t.is(
    snabby`<input @class:x=${false}>`.data.class.x,
    false,
    'sets a prop to the real false value, not a string'
  )
})


test('flatten array children', function (t) {
  t.plan(1)
  const arr = [
    snabby`<span>1</span>`,
    snabby`<span>2</span>`,
  ]
  t.is(
    snabby`<span> ${arr} ${arr} </span>`.children.length,
    7,
    'flattens nested arrays'
  )
})


test('thunk', function (t) {
  t.plan(4)

  let invocationCount = 0

  const numberView = function (n) {
    invocationCount += 1
    return snabby`<span>Number is ${n}</span>`
  }

  t.same(invocationCount, 0)

  let view = snabby.update(document.body, snabby`<div>${snabby.thunk('num', numberView, [1])}</div>`)
  t.same(invocationCount, 1)

  view = snabby.update(view, snabby`<div>${snabby.thunk('num', numberView, [1])}</div>`)
  t.same(invocationCount, 1)

  view = snabby.update(view, snabby`<div>${snabby.thunk('num', numberView, [4])}</div>`)
  t.same(invocationCount, 2)

})
