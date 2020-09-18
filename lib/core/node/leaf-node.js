const SimpleNode = require('./simple-node.js').SimpleNode;

class LeafNode extends SimpleNode{
	constructor(chooser, parentNode, children, command, parameters){
        super(chooser, parentNode, children)
        this.command = command;
        this.parameters = parameters;
    }

    resolve () {
        this.commandRunner.run(this.command, this.parameters);
    }
}

module.exports = {
    LeafNode
}
