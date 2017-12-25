
# snabby

> Use Snabbdom with template strings

```js
var html = require('snabby')

// Create vnodes:
var foo = html`<div>Hello Earth</div>`
var bar = html`<div>Hello Mars</div>`

// Patch to DOM:
html.update(document.body, foo)

// Patch updates:
html.update(foo, bar)
```

Snabby is for creating [Snabbdom](https://github.com/snabbdom/snabbdom) [virtual nodes](https://github.com/snabbdom/snabbdom#virtual-node) using template strings, and also patch the nodes using an [`update` function](#snabby_update) (inspired by [`yo-yo`](https://npmjs.com/yo-yo)).  It makes working with an [amazing virtual dom](https://github.com/snabbdom/snabbdom#features) very easy and fun

## Installation

```sh
$ npm install --save snabby
```

## Usage

### `snabby`

A [tag function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals) that creates a node.  This function is usually required as `html` instead of `snabby`:

```js
var html = require('snabby')

// Function to create VNode from params:
var greet = name => html`
  <div class='greet'>Hello, ${name}!</div>
`

var node1 = greet('Jamen')
// Hello, Jamen!

var node2 = greet('World')
// Hello, World!
```

You have all the [modules documented by Snabbdom](https://github.com/snabbdom/snabbdom#modules-documentation) loaded by default.  See [Directives](#directives) for how to use modules, and [`snabby/create`](#snabby_create) for loading custom modules

### Directives

Directives are attributes that begin with `@`, and let you interact with Snabbdom modules.  In general, the form is `@<name>:[prop]:...`.

Here is an example using the [`props`](https://github.com/snabbdom/snabbdom#the-props-module) module:

```js
html`<a @props=${{ href: '/foo', textContent: 'Hello' }}></a>`

// Or using the `:prop` syntax:
html`<a @props:href='/foo' @props:textContent='Hello'></a>`
```

For the [`eventlisteners`](https://github.com/snabbdom/snabbdom#eventlisteners-module) module, you can use a shorthand by prefixing with `:` instead of `@on:`:

```js
html`<div @on:click=${fn}>...</div>`

// Shorthand:
html`<div :click=${fn}>`
```

Directives work with any module that makes use of `node.data`.  For example `@props:href` turns into `node.data.props.href`.

### `snabby.update(target, node)`

If you want to put a node on the DOM, or push updates on it (i.e. from events), you use this function.

First things first, the Node has to be mounted to the DOM, _before_ you try and update it:

```js
var html = require('snabby')

var visit = location => html`
  <div class='app'>Hello, ${location}!</div>
`

var node1 = visit('Earth')

// Mount node to DOM
html.update(document.body, node1)
// Hello, Earth!
```

From there, you can patch updates:

```js
var node2 = visit('TRAPPIST-1')

// Patch updates to node1
html.update(node1, node2)
// Hello, TRAPPIST-1!
```

### `snabby/create`

Create a `snabby` tag function with your own modules.

Here is an equivalent to `snabby` for example:

```js
var html = require('snabby/create')([
  require('snabbdom/modules/attributes').default,
  require('snabbdom/modules/eventlisteners').default,
  require('snabbdom/modules/class').default,
  require('snabbdom/modules/props').default,
  require('snabbdom/modules/style').default
])
```

As mentioned, you can use directives with 3rd party modules fine.  Open an issue if you can't!

## Prior Art

These ideas come from my time using:

 - [`yo-yo`](https://npmjs.com/yo-yo): Inspired some of the API here
 - [`hyperx`](https://npmjs.com/hyperx): Handles the template string parsing here
 - [`choo`](https://npmjs.com/choo): What inspired me to create this module, as I love the API, but not `morphdom` as much
 - [`bel`](https://npmjs.com/bel):  Notable mention.  It's like twin sister to this. DOM and VDOM
 - [`snabbdom`](https://npmjs.com/snabbdom): What gives this the speed
 - [`vue`](https://npmjs.com/vue): A front-end framework that uses `snabbdom` and loosely inspired me

## License

MIT © [Jamen Marz](https://git.io/jamen)

---

[![version](https://img.shields.io/npm/v/snabby.svg?style=flat-square)](https://npmjs.com/package/snabby) [![travis](https://img.shields.io/travis/snabby/jamen.svg?style=flat-square)](https://travis-ci.org/snabby/jamen) [![downloads/month](https://img.shields.io/npm/dm/snabby.svg?style=flat-square)](https://npmjs.com/package/snabby) [![downloads](https://img.shields.io/npm/dt/snabby.svg?style=flat-square)](https://npmjs.com/package/snabby) [![license](https://img.shields.io/npm/l/snabby.svg?style=flat-square)](https://npmjs.com/package/snabby) [![support me](https://img.shields.io/badge/support%20me-paypal-green.svg?style=flat-square)](https://www.paypal.me/jamenmarz/5usd) [![follow](https://img.shields.io/github/followers/jamen.svg?style=social&label=Follow)](https://github.com/jamen)
