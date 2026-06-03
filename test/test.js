import './setup.js'
import snabby   from '../index.js'
import { h }    from 'snabbdom' // helper function for creating vnodes
import assert   from 'node:assert/strict'
import test     from 'node:test'


test('creation', function () {
  assert.deepEqual(
    snabby`<span>Hello world!</span>`,
    h('span', 'Hello world!'),
    'span node'
  )

  assert.deepEqual(
    snabby`<div><span>Hello</span><span>world!<span>(You're awesome)</span></span></div>`,
    h('div', [ h('span', 'Hello'), h('span', [ 'world!', h('span', '(You\'re awesome)') ]) ]),
    'nested nodes'
  )
})


test('event listeners', function () {
  function sample () {}
  function sample2 () {}

  assert.deepEqual(
    snabby`<span @on:click=${sample}>Hello world</span>`.data.on,
    { click: sample },
    'single listener'
  )

  assert.deepEqual(
    snabby`<span @on:click=${sample} @on:input=${sample2}></span>`.data.on,
    { click: sample, input: sample2 },
    'multiple listeners'
  )
})


test('class attribute', function () {
  assert.equal(
    snabby`<span class='foo'>Hello world</span>`.data.attrs.class,
    'foo',
    'adds class selector'
  )
})


test('boolean attribute', function () {
  assert.equal(
    snabby`<img disabled="false" />`.data.attrs.disabled,
    false,
    'sets false value for boolean attributes'
  )

  assert.equal(
    snabby`<img disabled="true" />`.data.attrs.disabled,
    'true',
    'sets value for boolean attributes'
  )

  assert.equal(
    snabby`<img disabled />`.data.attrs.disabled,
    'disabled',
    'sets value for boolean attributes'
  )

  assert.equal(
    snabby`<img @attrs:disabled=${false} />`.data.attrs.disabled,
    false,
    'preserves value for boolean attributes in @attrs: directives'
  )

  assert.equal(
    snabby`<img @attrs:disabled=${'false'} />`.data.attrs.disabled,
    false,
    'preserves value for boolean attributes in @attrs: directives'
  )

  assert.equal(
    snabby`<img @attrs:disabled=${'disabled'} />`.data.attrs.disabled,
    'disabled',
    'preserves value for boolean attributes in @attrs: directives'
  )

  assert.equal(
    snabby`<img @attrs:disabled=${true} />`.data.attrs.disabled,
    'true',
    'preserves value for boolean attributes in @attrs: directives'
  )

  assert.equal(
    snabby`<img @attrs:disabled=${'true'} />`.data.attrs.disabled,
    'true',
    'preserves value for boolean attributes in @attrs: directives'
  )
})


test('non-boolean attribute', function () {
  assert.equal(
    snabby`<img draggable="false" />`.data.attrs.draggable,
    'false',
    'preserves "false" value for non-boolean attributes'
  )

  assert.equal(
    snabby`<img draggable="true" />`.data.attrs.draggable,
    'true',
    'preserves "true" value for non-boolean attributes'
  )

  assert.equal(
    snabby`<img @attrs:draggable=${false} />`.data.attrs.draggable,
    'false',
    'preserves value for non-boolean attributes in @attrs: directives'
  )

  assert.equal(
    snabby`<img @attrs:draggable=${'false'} />`.data.attrs.draggable,
    'false',
    'preserves value for non-boolean attributes in @attrs: directives'
  )

  assert.equal(
    snabby`<img @attrs:draggable=${true} />`.data.attrs.draggable,
    'true',
    'preserves value for non-boolean attributes in @attrs: directives'
  )

  assert.equal(
    snabby`<img @attrs:draggable=${'true'} />`.data.attrs.draggable,
    'true',
    'preserves value for non-boolean attributes in @attrs: directives'
  )
})


test('non-string attribute value', function () {
  assert.equal(
    snabby`<input @class:x=${false}>`.data.class.x,
    false,
    'sets a prop to the real false value, not a string'
  )
})


test('props', function () {
  assert.equal(
    snabby`<input @props:enabled=${false}>`.data.props.enabled,
    false,
    'sets a prop to the real false value, not a string'
  )

  assert.equal(
    snabby`<input @props:enabled=${true}>`.data.props.enabled,
    'true',
    'sets a prop to the real false value, not a string'
  )

  assert.equal(
    snabby`<input @props:derp=${'flerp'}>`.data.props.derp,
    'flerp',
    'sets a prop to a string value'
  )

  assert.deepEqual(
    snabby`<input @props:cool=${ { a: true, b: 345 } }>`.data.props.cool,
    { a: true, b: 345 },
    'sets a prop to an object value'
  )
})


test('flatten array children', function () {
  const arr = [
    snabby`<span>1</span>`,
    snabby`<span>2</span>`,
  ]
  assert.equal(
    snabby`<span> ${arr} ${arr} </span>`.children.length,
    7,
    'flattens nested arrays'
  )
})


test('thunk', function () {
  let invocationCount = 0

  const numberView = function (n) {
    invocationCount += 1
    return snabby`<span>Number is ${n}</span>`
  }

  assert.equal(invocationCount, 0)

  let view = snabby.update(document.body, snabby`<div>${snabby.thunk('num', numberView, [1])}</div>`)
  assert.equal(invocationCount, 1)

  view = snabby.update(view, snabby`<div>${snabby.thunk('num', numberView, [1])}</div>`)
  assert.equal(invocationCount, 1)

  view = snabby.update(view, snabby`<div>${snabby.thunk('num', numberView, [4])}</div>`)
  assert.equal(invocationCount, 2)
})
