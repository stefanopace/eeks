const { ConfigParser } = require('./config-parser.js');

const execute = (config, runner, chooser) => {
	const rootNode = 
		(new ConfigParser(runner, chooser)).parseConfig(config, null);

	return rootNode.resolve();
}

module.exports = {
	execute
}