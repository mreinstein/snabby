
# snabby

> Create and patch Snabbdom nodes using template strings

```js
var snabby = require('snabby')([ ...modules ])

// Patch to DOM node:
var foo = snabby`<div>Hello Earth</div>`
snabby.update(document.body, foo)

// Patch update to vnode:
var bar = snabby`<div>Hello Mars</div>`
snabby.update(foo, bar)
```

Inspired by [`yo-yo`](https://npmjs.com/yo-yo) and [`hyperx`](https://npmjs.com/hyperx).  Snabby is similar enough with `yo-yo` to be able to replace it most of the time; although, it is not fully compatible. See [Compatibility](#compatibility) for specifics.

## Installation

```sh
$ npm install --save snabby
```

## Usage

### `init(modules)`

Create a [`snabby` tag function](#snabby_tag) with an array of [Snabbdom modules](https://github.com/snabbdom/snabbdom#modules-documentation) or strings of default Snabbdom module names (e.g. `'class', 'style', 'eventlisteners'`).  You will probably just want to execute this function right as you require `snabby`:

```js
var snabby = require('snabby')([
  // Typical Snabbdom module:
  require('snabbdom-thing'),

  // Modules in `snabbdom/modules/*`:
  'eventlisteners',
  'style',
  'props'
])
```

<a name='snabby_tag'></a>
### `snabby`

A template string tag for creating [Snabbdom vnodes](https://github.com/snabbdom/snabbdom#virtual-node).  It is [`hyperx`](https://npmjs.com/hyperx) combined with [`snabbdom/h`](https://github.com/snabbdom/snabbdom#snabbdomh).

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

### `snabby.update(destination, source)`

Patch a vnode to the DOM, or to another vnodes.  See [Snabbdom's `patch`](https://github.com/snabbdom/snabbdom#patch) for more information on the process.  It is nearly the same as [`yo.update`](https://github.com/maxogden/yo-yo#youpdatetargetelement-newelement-opts), making it somewhat compatible.

```js
// Create two vnodes:
var foo = snabby`<div>Hello <span>Earth</span></div>`
var bar = snabby`<div>Hello <span>Mars</span></div>`

// Patch one to the DOM
snabby.update(document.body, foo)

// Patch vnode to the other:
snabby.update(foo, bar)
```

## Compatibility

If you use [`snabby.update` on a DOM node first](https://github.com/snabbdom/snabbdom#patch) and never use [`opts.events`](https://github.com/maxogden/yo-yo#youpdatetargetelement-newelement-opts) (which is probably majority of cases), then you have compatible APIs.

Just in case, here is a list of some drawbacks:

 - `snabby` has an `init` function, while `yo-yo` can be used straight from being required.
 - `yo.update`'s `opts.events` is not supported, because `snabbdom` preloads modules, and doesn't take options while patching.
 - `snabby.update`'s "call order" follows [`snabbdom`'s `patch`](https://github.com/snabbdom/snabbdom#patch), which can lead to slightly confusing errors compared to `yo-yo`.
 - `snabby` possibly contains extra functions that would make extra work transitioning to `yo-yo`.
 - The "updating" and "patching" terms differ which might be confusing.  They are used interchangably in this project.

## Prior Art

All of these ideas come from my time using: [`yo-yo`](https://npmjs.com/yo-yo), [`hyperx`](https://npmjs.com/hyperx), [`choo`](https://npmjs.com/choo), [`bel`](https://npmjs.com/bel), [`vue`](https://npmjs.com/vue), and of course [`snabbdom`](https://npmjs.com/snabbdom).  Check them out, they are cool!

## License

MIT © [Jamen Marz](https://git.io/jamen)

---

[![version](https://img.shields.io/npm/v/snabby.svg?style=flat-square)][package] [![travis](https://img.shields.io/travis/snabby/jamen.svg?style=flat-square)](https://travis-ci.org/snabby/jamen) [![downloads/month](https://img.shields.io/npm/dm/snabby.svg?style=flat-square)][package] [![downloads](https://img.shields.io/npm/dt/snabby.svg?style=flat-square)][package] [![license](https://img.shields.io/npm/l/snabby.svg?style=flat-square)][package] [![support me](https://img.shields.io/badge/support%20me-paypal-green.svg?style=flat-square)](https://www.paypal.me/jamenmarz/5usd) [![follow](https://img.shields.io/github/followers/jamen.svg?style=social&label=Follow)](https://github.com/jamen)
[package]: https://npmjs.com/package/snabby
