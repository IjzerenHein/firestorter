const rollup = require('rollup');
const fs = require('fs-extra');
const path = require('path');
const ts = require('typescript');
const shell = require('shelljs');
const exec = shell.exec;

// exit upon first error
shell.set('-e');

const binFolder = path.resolve('node_modules/.bin/');

function getCmd(cmd) {
	if (process.platform === 'win32') {
		return path.join(binFolder, cmd + '.cmd');
	}
	return cmd;
}

// make sure we're in the right folder
process.chdir(path.resolve(__dirname, '..'));

fs.removeSync('lib');
fs.removeSync('.build.cjs');
fs.removeSync('.build.es');

function runTypeScriptBuild(outDir, target, declarations) {
	console.log(
		`Running typescript build (target: ${ts.ScriptTarget[target]}) in ${outDir}/`
	);

	const tsConfig = path.resolve('tsconfig.json');
	const json = ts.parseConfigFileTextToJson(
		tsConfig,
		ts.sys.readFile(tsConfig),
		true
	);

	const { options } = ts.parseJsonConfigFileContent(
		json.config,
		ts.sys,
		path.dirname(tsConfig)
	);

	options.target = target;
	options.outDir = outDir;
	options.declaration = declarations;

	options.module = ts.ModuleKind.ES2015;
	options.importHelpers = true;
	options.noEmitHelpers = true;
	if (declarations) options.declarationDir = path.resolve('.', 'lib');

	const rootFile = path.resolve('src', 'index.ts');
	const host = ts.createCompilerHost(options, true);
	const prog = ts.createProgram([rootFile], options, host);
	const result = prog.emit();
	if (result.emitSkipped) {
		const message = result.diagnostics
			.map(
				d =>
					`${ts.DiagnosticCategory[d.category]} ${d.code} (${d.file}:${
						d.start
					}): ${d.messageText}`
			)
			.join('\n');

		throw new Error(`Failed to compile typescript:\n\n${message}`);
	}
}

const rollupPlugins = [
	require('rollup-plugin-node-resolve')(),
	require('rollup-plugin-filesize')()
];

function generateBundledModule(inputFile, outputFile, format, moduleName) {
	console.log(`Generating ${outputFile} bundle.`);

	return rollup
		.rollup({
			input: inputFile,
			plugins: rollupPlugins,
			external: ['mobx']
		})
		.then(bundle =>
			bundle.write({
				file: outputFile,
				format,
				name: moduleName,
				banner:
					'/** Firestorter - (c) Hein Rutjes 2017 - 2019 - MIT Licensed */',
				exports: 'named',
				globals: {
					mobx: 'mobx'
				}
			})
		);
}

function generateMinified() {
	const prodEnv = {
		...process.env,
		NODE_ENV: 'production'
	};

	console.log('Generating firestorter.min.js and firestorter.umd.min.js');
	exec(`${getCmd(`envify`)} lib/firestorter.js > lib/firestorter.prod.js`, {
		env: prodEnv
	});
	exec(
		`${getCmd(
			'uglifyjs'
		)} --toplevel -m -c warnings=false --preamble "/** Firestorter - (c) Hein Rutjes 2017 - 2019 - MIT Licensed */" --source-map -o lib/firestorter.min.js lib/firestorter.prod.js`
	);
	exec(
		`${getCmd(`envify`)} lib/firestorter.umd.js > lib/firestorter.prod.umd.js`,
		{
			env: prodEnv
		}
	);
	exec(
		`${getCmd(
			`uglifyjs`
		)} --toplevel -m -c warnings=false --preamble "/** Firestorter - (c) Hein Rutjes 2017 - 2019 - MIT Licensed */" --source-map -o lib/firestorter.umd.min.js lib/firestorter.prod.umd.js`
	);
	shell.rm('lib/firestorter.prod.js', 'lib/firestorter.prod.umd.js');
}

/* function copyFlowDefinitions() {
	console.log('Copying flowtype definitions');
	exec(`${getCmd(`ncp`)} flow-typed/firestorter.js lib/firestorter.js.flow`);
}*/

function build() {
	runTypeScriptBuild('.build.es5', ts.ScriptTarget.ES5, true);
	runTypeScriptBuild('.build.es6', ts.ScriptTarget.ES2015, false);
	return Promise.all([
		generateBundledModule(
			path.resolve('.build.es5', 'index.js'),
			path.resolve('lib', 'firestorter.js'),
			'cjs'
		),

		generateBundledModule(
			path.resolve('.build.es5', 'index.js'),
			path.resolve('lib', 'firestorter.umd.js'),
			'umd',
			'firestorter'
		),

		generateBundledModule(
			path.resolve('.build.es5', 'index.js'),
			path.resolve('lib', 'firestorter.module.js'),
			'es'
		),

		generateBundledModule(
			path.resolve('.build.es6', 'index.js'),
			path.resolve('lib', 'firestorter.es6.js'),
			'es'
		)
	]).then(() => {
		generateMinified();
		// copyFlowDefinitions();
	});
}

build().catch(e => {
	console.error(e);
	if (e.frame) {
		console.error(e.frame);
	}
	process.exit(1);
});
