filename = process.argv[2];

const automenu = require('./core/automenu.js');
const parser = require('./adapters/json-parser.js');
const rootNode = parser.toTree(filename);

automenu.execute(rootNode);