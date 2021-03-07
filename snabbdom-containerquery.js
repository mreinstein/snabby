// inspired by https://philipwalton.com/articles/responsive-components-a-solution-to-the-container-queries-problem/

// ResizeObserver support is pretty good, but about 10% of the browsers still lack it.
// in some cases, snabbdom is used as a 3rd party module that gets used on websites,
// and it's unacceptable in some cases to install global polyfills.
//
// for now we inline it into the plugin as a ponyfill so that it's always available,
// doesn't pollute global scope, and works in almost all in-use browsers, at the cost of a few kb.
//
// https://github.com/que-etc/resize-observer-polyfill
import ResizeObserver from 'https://cdn.skypack.dev/resize-observer-polyfill';


// today it's more performant to have 1 resizeObserver observe multiple elements rather than 1 per element.
// see https://groups.google.com/a/chromium.org/g/blink-dev/c/z6ienONUb5A/m/F5-VcUZtBAAJ
const observer = new ResizeObserver(function (entries) {
	for (const entry of entries) {
		const breakpoints = JSON.parse(entry.target.dataset.breakpoints);

		// the rule iteration order depends on the order the object keys, and this varies from browser to browser.
		// keep track of a high water mark so we always apply the widest matching rule regardless of iteration order.
		let highWaterMark = 0;

		let selectedClass = '';

		for (const breakpoint of Object.keys(breakpoints)) {
			const minWidth = breakpoints[breakpoint];
	        if (entry.contentRect.width >= minWidth && minWidth > highWaterMark) {
	        	selectedClass = breakpoint;
	        	highWaterMark = minWidth;
	        }
	    }

	    for (const breakpoint of Object.keys(breakpoints)) {
	    	if (breakpoint === selectedClass) {
	    		if (!entry.target.classList.contains(breakpoint))
	    			entry.target.classList.add(breakpoint);

	    	} else if (entry.target.classList.contains(breakpoint)) {
	    		entry.target.classList.remove(breakpoint);
	    	}
	    }
	}
});


function update (oldVnode, vnode) {
	if (vnode.elm.dataset.breakpoints) {
		try {
			// ensure that the data attribute parses as valid json before we start observing it
			JSON.parse(vnode.elm.dataset.breakpoints);
			observer.observe(vnode.elm);
		} catch (er) {
			// TODO: should invalid json in the data-breakpoints attribute throw an error?
		}
	} else {
		observer.unobserve(vnode.elm);
	}
}


function destroy (vnode/*, removeCallback*/) {
	observer.unobserve(vnode.elm);
}


export default {
	create: update,
	update,
	destroy
}
