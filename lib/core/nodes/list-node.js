const SimpleNode = require('./simple-node.js').SimpleNode;

class ListNode extends SimpleNode{
	constructor(runner, chooser, choiceName, parentNode, children, matcher, options) {
		super(runner, chooser, choiceName, parentNode, children, matcher);
		this.options = options;
	}

	generateOptions(_parameters) {
		return this.options;
	}
}

module.exports = {
	ListNode
}