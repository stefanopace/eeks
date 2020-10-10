const { SimpleNode } = require('./simple-node.js');

class ListNode extends SimpleNode{
	constructor(runner, chooser, choiceName, parentNode, children, matchers, options, filters) {
		super(runner, chooser, choiceName, parentNode, children, matchers, filters);
		this.options = options;
	}

	generateOptions(_parameters) {
		return this.options;
	}
}

module.exports = {
	ListNode
}