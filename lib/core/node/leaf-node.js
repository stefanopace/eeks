const SimpleNode = require('./simple-node.js').SimpleNode;

class LeafNode extends SimpleNode{
	constructor(commandRunner, chooser, parentNode, command, parameters){
        super(commandRunner, chooser, parentNode, null)
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
