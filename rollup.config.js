import resolve  from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace  from 'rollup-plugin-replace'


export default {
	plugins: [
		resolve(),
		commonjs(),
		replace({
		    'process.env.NODE_ENV': `'production'`
		})
	]
}
