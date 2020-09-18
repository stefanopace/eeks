const SimpleNode = require('./simple-node.js').SimpleNode;

class ListNode extends SimpleNode{
	constructor(chooser, parentNode, children, optionsList){
		super(chooser, parentNode, children)
		this.optionsList = optionsList;
	}

	generateOptions() {
		return this.optionsList;
	}
}

module.exports = {
	ListNode
}