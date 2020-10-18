#!/usr/bin/env node

const { argv } = require("yargs")
	.scriptName('izi')
	.option("c", {
		alias: "configurations",
		describe: "Json files with the configured menu",
		default: ["izi.json"],
		type: "array"
	})
	.option("e", {
		alias: "source",
		describe: "Shell scripts that will be sourced before each command",
		default: [],
		type: "array"
	})
	.option("s", {
		alias: "select",
		describe: "Option to autoselect without prompt",
		default: [],
		type: "array"
	})
	.options("v", {
		alias: "verbose",
		describe: "Launch the program in verbose mode",
		default: false,
		type: "boolean"
	})
	.options("simple", {
		describe: "Launch the program with the simple chooser instead of fzf",
		default: false,
		type: "boolean"
	})
	.options("d", {
		alias: "debug",
		describe: "Launch the program in debug mode",
		default: false,
		type: "boolean"
	})
	.strict()
	.epilog("Developed by Stefano Pace,\nstefanopace01@gmail.com")

const automenu = require('./core/automenu');
const { ScriptedChooser } = require('./core/choices/scripted-chooser');
const { EarlyExit } = require('./core/results/early-exit');
const { RuntimeError } = require('./core/results/runtime-error');
const { MissingElegibleResolver } = require('./core/results/missing-elegible-resolver');
const { FzfChooser, fzfIsAvailable } = require('./adapters/fzf-chooser');
const { SimpleChooser } = require('./adapters/simple-chooser');
const { SystemRunner } = require('./adapters/system-runner');
const { Debugger } = require('./adapters/debugger');
const { DummyDebugger } = require('./adapters/dummy-debugger');
const fs = require('fs');
const chalk = require('chalk');

const premadeChoices = argv.select;
const configFilenames = argv.configurations;
const debug = argv.debug ? new Debugger() : new DummyDebugger();
const configs = configFilenames.map(configFilename => JSON.parse(fs.readFileSync(configFilename, 'utf-8')));

const config = configFilenames.length === 1 
	? JSON.parse(fs.readFileSync(configFilenames[0], 'utf-8'))
	: {
		"type": "list",
		"options": configFilenames.map(name => name.replace(/\.json$/,'')),
		"handlers": configFilenames.map(configFilename => ({
				...(JSON.parse(fs.readFileSync(configFilename, 'utf-8'))),
				["match-exact"]: [configFilename.replace(/\.json$/,'')]
		}))
	}

const runner = new SystemRunner(argv.source, argv.debug);
const chooser = new ScriptedChooser(
	premadeChoices,
	!fzfIsAvailable() || argv.simple
		? new SimpleChooser(debug)
		: new FzfChooser(debug)
	)

const result = automenu.execute(config, runner, chooser, debug);

if (result instanceof EarlyExit) {
	runner.clearScreen();
	if (argv.verbose){
		console.info(chalk.bold('Execution stopped by user'));
	}
	process.exit(1);
}

if (result instanceof MissingElegibleResolver) {
	runner.clearScreen();
	console.error(chalk.bold(chalk.red("No action available for the selected item. :(")));
	console.error(chalk.bold("Stacktrace:"));
	console.error(result.getTrace());
	process.exit(2);
}

if (result instanceof RuntimeError) {
	runner.clearScreen();
	console.error(chalk.bold(chalk.red("An error occurred during the execution! :(")));
	console.error(chalk.bold("Stacktrace:"));
	console.error(result.getTrace());
	process.exit(3);
}

if (argv.verbose){
	runner.clearScreen();
	console.info(result.getLastTrace())
}

if (argv.debug){
	runner.clearScreen();
	console.debug(chalk.bold("Stacktrace:"));
	console.debug(result.getTrace())
}
