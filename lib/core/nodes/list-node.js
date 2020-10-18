const { SimpleNode } = require('./simple-node');

class ListNode extends SimpleNode{
	constructor(runner, chooser, setters, parentNode, children, matchers, options) {
		super(runner, chooser, setters, parentNode, children, matchers);
		this.options = options;
	}

	generateOptions(_parameters) {
		return this.options;
	}
}

module.exports = {
	ListNode
}
