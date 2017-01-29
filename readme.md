
# snabby

> Snabbdom vnodes using template strings

```js
var snabby = require('snabby')([ ...modules ])

// Create vnodes:
var foo = snabby`<div>Hello Earth</div>`
var bar = snabby`<div>Hello Mars</div>`

// Patch to DOM node:
snabby.update(document.body, foo)

// Patch update:
snabby.update(foo, bar)
```

Snabby is for creating [Snabbdom](https://github.com/snabbdom/snabbdom) [virtual nodes](https://github.com/snabbdom/snabbdom#virtual-node) using template strings.  You can also patch the nodes using an [`update` function](#snabby_update) similar to how [`yo-yo`](https://npmjs.com/yo-yo) does it.  It makes working with an [amazing virtual dom](https://github.com/snabbdom/snabbdom#features) very easy and fun

## Installation

```sh
$ npm install --save snabby

# With Yarn:
$ yarn add snabby
```

## Usage

### `require('snabby')(modules)`

Initialize `snabby` with an array of [Snabbdom modules](https://github.com/snabbdom/snabbdom#modules-documentation).  Defaults modules (e.g. `style` or `props`) expand to their associated `snabbdom/modules/*` file for convenience

```js
var snabby = require('snabby')([
  // Snabbdom modules:
  require('snabbdom-foo'),
  require('snabbdom-bar'),
  // Default shortcuts:
  'style',
  'props'
])
```

<a name='snabby_tag'></a>
### `snabby`

A template string tag for creating [Snabbdom vnodes](https://github.com/snabbdom/snabbdom#virtual-node).  It is simply  [`snabbdom/h`](https://github.com/snabbdom/snabbdom#snabbdomh) combined with [`hyperx`](https://npmjs.com/hyperx) for creating them using template string syntax

```js
var foo = snabby`
  <div>
    <p>
      Hello <span>World</span>! <br>
      How are you today?
    </p>
    <p>I'm a planet, stop talking to me</p>
  </div>
`
```

<a name='snabby_update'></a>
### `snabby.update(destination, source)`

Patch vnodes to the DOM, or patch updates.  See [Snabbdom's `patch`](https://github.com/snabbdom/snabbdom#patch) for more information on the process.  It is nearly the same as [`yo.update`](https://github.com/maxogden/yo-yo#youpdatetargetelement-newelement-opts)'s usage, making it mostly compatible

```js
// Create two vnodes:
var foo = snabby`<div>Hello <span>Earth</span></div>`
var bar = snabby`<div>Hello <span>Mars</span></div>`

// Patch one to the DOM
snabby.update(document.body, foo)

// Patch vnode to the other:
snabby.update(foo, bar)
```

## Prior Art

These ideas come from my time using:

 - [`yo-yo`](https://npmjs.com/yo-yo): A module I've used and enjoyed, and inspired the API here
 - [`hyperx`](https://npmjs.com/hyperx): A fantastic module that pretty much does all the hard work for me!
 - [`choo`](https://npmjs.com/choo): What inspired me to create this module, as I love the API, but not `morphdom` as much
 - [`bel`](https://npmjs.com/bel):  Notable mention.  It's like twin sister to this. DOM and VDOM
 - [`snabbdom`](https://npmjs.com/snabbdom): An amazing virtual DOM.  Get on reading that README boi!
 - [`vue`](https://npmjs.com/vue): A front-end framework that uses `snabbdom` and loosely inspired me

## License

MIT © [Jamen Marz](https://git.io/jamen)

---

[![version](https://img.shields.io/npm/v/snabby.svg?style=flat-square)][package] [![travis](https://img.shields.io/travis/snabby/jamen.svg?style=flat-square)](https://travis-ci.org/snabby/jamen) [![downloads/month](https://img.shields.io/npm/dm/snabby.svg?style=flat-square)][package] [![downloads](https://img.shields.io/npm/dt/snabby.svg?style=flat-square)][package] [![license](https://img.shields.io/npm/l/snabby.svg?style=flat-square)][package] [![support me](https://img.shields.io/badge/support%20me-paypal-green.svg?style=flat-square)](https://www.paypal.me/jamenmarz/5usd) [![follow](https://img.shields.io/github/followers/jamen.svg?style=social&label=Follow)](https://github.com/jamen)
[package]: https://npmjs.com/package/snabby
