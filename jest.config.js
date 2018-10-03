module.exports = {
	"transform": {
		"^.+\\.js?$": "<rootDir>/node_modules/babel-jest",
		"^.+\\.tsx?$": "ts-jest"
	},
	"testRegex": "/test/.*.test.js$",
	"moduleFileExtensions": [
		"ts",
		"tsx",
		"js",
		"jsx",
		"json",
		"node"
	],
};
