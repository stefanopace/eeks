filename = process.argv[2];
premadeChoices = process.argv.slice(3);

const fs = require('fs');
const automenu = require('./core/automenu');
const { ScriptedChooser } = require('./core/choices/scripted-chooser');
const { FzfChooser, fzfIsAvailable } = require('./adapters/fzf-chooser');
const { SimpleChooser } = require('./adapters/simple-chooser');
const { SystemRunner } = require('./adapters/system-runner');
const { EarlyExit } = require('./core/results/early-exit');
const { RuntimeError } = require('./core/results/runtime-error');
const { MissingElegibleResolver } = require('./core/results/missing-elegible-resolver');

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
    console.error("Stacktrace:");
    console.error(result.getTrace());
    process.exit(2);
}

if (result instanceof RuntimeError) {
    runner.clearScreen();
    console.error("An error occurred during the execution! :(");
    console.error("Stacktrace:");
    console.error(result.getTrace());
    process.exit(3);
}

runner.clearScreen();
console.info(result.getLastTrace())
