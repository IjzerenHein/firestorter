module.exports = function(w) {
	return {
		files: [
			'src/*.ts',
			'test/*.{ts,js}',
			'!test/*.test.{ts,js}',
			{ pattern: 'babel.config.js', instrument: false },
			{ pattern: 'test/firebaseConfig.json', instrument: false }
		],
		tests: ['test/*.test.{ts,js}'],
		env: {
			type: 'node'
		},
		workers: {
			// Since tests re-use the same collections
			initial: 1,
			regular: 1
		},
		testFramework: 'jest'
	};
};
