const SimpleNode = require('./simple-node.js').SimpleNode;

class ListNode extends SimpleNode{
	constructor(commandRunner, chooser, parentNode, children, optionsList){
		super(commandRunner, chooser, parentNode, children)
		this.optionsList = optionsList;
	}

	generateOptions() {
		return this.optionsList;
	}
}

module.exports = {
	ListNode
}