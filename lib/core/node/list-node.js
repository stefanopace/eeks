const SimpleNode = require('./simple-node.js').SimpleNode;

class ListNode extends SimpleNode{
	constructor(runner, chooser, parentNode, children, matcher, options) {
		super(runner, chooser, parentNode, children, matcher);
		this.options = options;
	}

	generateOptions() {
		return this.options;
	}
}

module.exports = {
	ListNode
}