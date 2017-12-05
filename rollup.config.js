import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import progress from 'rollup-plugin-progress';

export default {
	entry: 'src/index.js',
	dest: 'dist/firestorter.js',
	format: 'umd',
	// sourceMap: true,
	moduleName: 'firestorter',
	external: ['mobx'],
	exports: 'named',
	globals: {
		mobx: 'mobx'
	},
	plugins: [
		babel({
			babelrc: false,
			plugins: [
				'transform-object-rest-spread',
				'transform-class-properties',
				'transform-flow-strip-types'
			],
			presets: ['es2015-rollup'],
			exclude: 'node_modules/**'
		}),
		resolve({
			module: true,
			jsnext: true,
			main: true
		}),
		commonjs(),
		filesize(),
		progress()
	]
};
