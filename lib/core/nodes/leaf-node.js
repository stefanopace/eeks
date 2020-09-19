const SimpleNode = require('./simple-node.js').SimpleNode;

class LeafNode extends SimpleNode{
	constructor(runner, parentNode, matcher, command){
        super(runner, null, parentNode, null, matcher)
        this.command = command;
    }

    resolve () {
        this.runner.run(this.command);
    }
}

module.exports = {
    LeafNode
}
