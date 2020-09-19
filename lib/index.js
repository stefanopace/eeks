filename = process.argv[2];

const fs = require('fs');
const automenu = require('./core/automenu.js');
const ConfigParser = require('./adapters/json-parser.js').ConfigParser;
const FzfChooser = require('./adapters/fzf-chooser.js').FzfChooser;
const SpyRunner = require('../tests/doubles/spy-runner.js').SpyRunner;

const parser = new ConfigParser(
    new SpyRunner(),
    new FzfChooser(), 
);
const config = fs.readFileSync(filename, 'utf-8');

const rootNode = parser.parseConfigFile(config);

automenu.execute(rootNode);