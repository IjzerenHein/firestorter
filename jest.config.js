module.exports = {
	preset: 'ts-jest/presets/js-with-babel',
	globals: {
		'ts-jest': {
			diagnostics: {
				ignoreCodes: [6133] // disables TS6133 - unused variables in tests
			}
		}
	}
};
