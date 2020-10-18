const { SimpleNode } = require('./simple-node');

class DynamicNode extends SimpleNode{
	constructor(runner, chooser, setters, parentNode, children, matchers, commands) {
		super(runner, chooser, setters, parentNode, children, matchers);
		this.commands = commands;
	}

	generateOptions(parameters) {
		return this.runner.execAndGetOutputAsArray(this.commands, parameters);
	}
}

module.exports = {
	DynamicNode
}
