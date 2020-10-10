const { SimpleNode } = require('./simple-node.js');

class DynamicNode extends SimpleNode{
	constructor(runner, chooser, choiceName, parentNode, children, matchers, commands, filters) {
		super(runner, chooser, choiceName, parentNode, children, matchers, filters);
		this.commands = commands;
	}

	generateOptions(parameters) {
		return this.runner.execAndGetOutputAsArray(this.commands, parameters);
	}
}

module.exports = {
	DynamicNode
}