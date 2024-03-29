# changelog

## 6.1.1
* update deps


## 6.1.0
* replace hyperx-tmp with hyperx now that the module has necessary bug fixes published


## 6.0.0
* remove built-in container queries.  You should use native css container queries now. Fixes #32
* support boolean attributes. Fixes #31


## 5.0.0
* update deps
* drop embedded ResizeObserver; it's now present in >= 94% of global web browsers. fixes #28


## 4.2.5
* update hyperx dep to fix inline styles that include a direct descendant css selector (see https://github.com/choojs/hyperx/issues/82)


## 4.2.4
* update snabbdom dep


## 4.2.3
* update snabbdom dep


## 4.2.2
* bugfix: only unobserve Element nodes in container query plugin


## 4.2.1
* use fixed version of hyperx that works with svgs


## 4.2.0
* update snabbdom to v3 (fixes #26)


## 4.1.2
* only unobserve container queries on Elements


## 4.1.1
* fix container query bug


## 4.1.0
* support HTML comments


## 4.0.0
* use a forked version of `hyperx`, which resolves a bug where some SVG tags throw an error. (see https://github.com/choojs/hyperx/pull/81)
* update deps


## 3.1.0
* only add/remove classes via containerquery when they actually change


## 3.0.0
* add container queries
* update dependencies


## 2.0.1
* fix the npm module to point at the built file


## 2.0.0
* require node v12.17+
* update snabbdom from 0.7 to 2.1
* convert to pure es module
* simplify examples


## 1.2.0

* add `thunk` support (fixes #5)
* update some modules


## 1.1.1

* add es module build to npm file list so it actually gets packaged


## 1.1.0

* add es module build
