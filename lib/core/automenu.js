const { ConfigParser } = require('./config-parser');

const execute = (config, runner, chooser, debug) => {
	const rootNode = 
		(new ConfigParser(runner, chooser, debug)).parseConfig(config, null);

	return rootNode.resolve();
}

module.exports = {
	execute
}
