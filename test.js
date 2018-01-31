var snabby = require('./')
var h = require('snabbdom/h').default
var test = require('tape')

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
  console.log(snabby`<input @class:x=${false}>`)
  t.is(
    snabby`<input @class:x=${false}>`.data.class.x,
    false,
    'sets a prop to the real false value, not a string'
  )
})
