filename = process.argv[2];
premadeChoices = process.argv.slice(3);

const fs = require('fs');
const automenu = require('./core/automenu.js');
const { ScriptedChooser } = require('./core/choices/scripted-chooser.js');
const { FzfChooser, fzfIsAvailable } = require('./adapters/fzf-chooser.js');
const { SimpleChooser } = require('./adapters/simple-chooser.js');
const { SystemRunner } = require('./adapters/system-runner');
const { EarlyExit } = require('./core/results/early-exit.js');
const { RuntimeError } = require('./core/results/runtime-error.js');
const { MissingElegibleResolver } = require('./core/results/missing-elegible-resolver.js');

const config = JSON.parse(fs.readFileSync(filename, 'utf-8'));
const runner = new SystemRunner();
const chooser = new ScriptedChooser(
    premadeChoices,
    fzfIsAvailable() 
        ? new FzfChooser() 
        : new SimpleChooser()
    )

const result = automenu.execute(config, runner, chooser);

if (result instanceof EarlyExit) {
    runner.clearScreen();
    console.info('Execution stopped by user');
    process.exit(1);
}

if (result instanceof MissingElegibleResolver) {
    runner.clearScreen();
    console.error("No action available for the selected item. :(");
    console.error(result.getTrace());
    process.exit(2);
}

if (result instanceof RuntimeError) {
    runner.clearScreen();
    console.error("An error occurred during the execution! :(");
    console.error(result.getTrace());
    process.exit(3);
}