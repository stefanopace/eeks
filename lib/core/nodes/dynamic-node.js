const { SimpleNode } = require('./simple-node.js');

class DynamicNode extends SimpleNode{
	constructor(runner, chooser, choiceName, parentNode, children, matchers, commands) {
		super(runner, chooser, choiceName, parentNode, children, matchers);
		this.commands = commands;
	}

	generateOptions(parameters) {
		return this.runner.execAndGetOutputAsArray(this.commands, parameters);
	}
}

module.exports = {
	DynamicNode
}