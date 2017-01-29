var snabby = require('./')()

var foo = snabby`<div>Hello world</div>`

snabby.update(document.body, foo)

var bar = snabby`<div>Hello Mars</div>`

snabby.update(foo, bar)
