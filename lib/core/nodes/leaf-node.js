const SimpleNode = require('./simple-node.js').SimpleNode;

class LeafNode extends SimpleNode{
	constructor(runner, parentNode, matcher, command){
        super(runner, null, null, parentNode, null, matcher)
        this.command = command;
    }

    resolve (parameters) {
        this.runner.runAndShowOutput(this.command, parameters);
    }
}

module.exports = {
    LeafNode
}
