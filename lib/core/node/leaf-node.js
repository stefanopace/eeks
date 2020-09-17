class leafNode {
	constructor(chooser, parentNode, children, command, parameters){
        super(chooser, parentNode, children)
        this.command = command;
        this.parameters = parameters;
    }

    resolve () {
        this.commandRunner.run(this.command, this.parameters);
    }
}