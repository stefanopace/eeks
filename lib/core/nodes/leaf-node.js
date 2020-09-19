const SimpleNode = require('./simple-node.js').SimpleNode;

class LeafNode extends SimpleNode{
	constructor(runner, chooser, parentNode, matcher, command){
        super(runner, chooser, parentNode, null, matcher)
        this.command = command;
    }

    resolve () {
        this.commandRunner.run(this.command);
    }
}

module.exports = {
    LeafNode
}
