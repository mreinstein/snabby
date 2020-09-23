import urlResolve from 'rollup-plugin-url-resolve'
import resolve    from '@rollup/plugin-node-resolve'
import commonjs   from '@rollup/plugin-commonjs'
import replace    from '@rollup/plugin-replace'


export default {
	plugins: [
        urlResolve(),
		resolve(),
		commonjs(),
		replace({
		    'process.env.NODE_ENV': `'production'`
		})
	]
}
