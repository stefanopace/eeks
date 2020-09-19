filename = process.argv[2];

const fs = require('fs');
const automenu = require('./core/automenu.js');
const { ConfigParser } = require('./adapters/json-parser.js');
const { FzfChooser } = require('./adapters/fzf-chooser.js');
const { SystemRunner } = require('./adapters/system-runner');

const parser = new ConfigParser(
    new SystemRunner(),
    new FzfChooser(), 
);
const config = fs.readFileSync(filename, 'utf-8');

const rootNode = parser.parseConfigFile(config);

automenu.execute(rootNode);