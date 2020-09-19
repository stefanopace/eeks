const SimpleNode = require('./simple-node.js').SimpleNode;

class LeafNode extends SimpleNode{
	constructor(runner, chooser, parentNode, matcher, command, parameters){
        super(runner, chooser, parentNode, null, matcher)
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
