filename = process.argv[2];

const automenu = require('./core/automenu.js');
const ConfigParser = require('./adapters/json-parser.js').ConfigParser;
const parser = new ConfigParser(null, null);
const rootNode = parser.parseConfigFile('');

automenu.execute(rootNode);