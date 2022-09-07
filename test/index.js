import browserEnv     from 'browser-env'
import ResizeObserver from 'resize-observer-polyfill'


browserEnv()

// browser-env doesn't provide browser APIs beyond pure DOM/window stuff
window.ResizeObserver = ResizeObserver
window.requestAnimationFrame = function () { }

async function main () {
	await import('./test.js');
}

main();
