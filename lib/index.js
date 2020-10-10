filename = process.argv[2];

const fs = require('fs');
const automenu = require('./core/automenu.js');
const { FzfChooser, fzfIsAvailable } = require('./adapters/fzf-chooser.js');
const { SimpleChooser } = require('./adapters/simple-chooser.js');
const { SystemRunner } = require('./adapters/system-runner');

const config = JSON.parse(fs.readFileSync(filename, 'utf-8'));
const runner = new SystemRunner();
const chooser = fzfIsAvailable() ? new FzfChooser() : new SimpleChooser;

automenu.execute(config, runner, chooser);