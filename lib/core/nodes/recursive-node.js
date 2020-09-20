const { SimpleNode } = require('./simple-node.js');

class RecursiveNode extends SimpleNode{
    constructor(
        runner,
        chooser,
        choiceName,
        parentNode,
        children,
        matchers,
        commands,
        accumulatorName,
        initialAccumulator,
        stopCondition
    ) {
        super(runner, chooser, choiceName, parentNode, children, matchers);
        this.commands = commands;
        this.accumulatorName = accumulatorName;
        this.initialAccumulator = initialAccumulator;
        this.stopCondition = stopCondition;
	}

	generateOptions(parameters) {
		return this.runner.execAndGetOutputAsArray(this.commands, parameters);
	}
    
    resolve(parameters){
        parameters = {
            ...parameters, 
            [this.accumulatorName]: parameters[this.accumulatorName] ? parameters[this.accumulatorName] : [this.initialAccumulator]
        }
        const options = this.generateOptions(parameters);
		const choiceMade = this.makeAChoice(options);

		if (choiceMade.exit()) { this.runner.quitProgram() };

        if (choiceMade.goBack()) {
            parameters = {
                ...parameters, 
                [this.accumulatorName]: parameters[this.accumulatorName].slice(0, -1)
            }
            if ( ! this.parentNode){
                this.runner.quitProgram();
            }
            this.parentNode.resolve(parameters);
            return
        }

		if (this.choiceName) {
			parameters = {...parameters, [this.choiceName]: choiceMade.name}
        }
        
        if (this.accumulatorName) {
            parameters = {
                ...parameters, 
                [this.accumulatorName]: [...(parameters[this.accumulatorName]), choiceMade.name]
            }
        }

        if (this.runner.statusCodeIsOk(this.stopCondition, parameters)){
            this.passToTheNextNode(choiceMade, parameters);
            return;
        }

        const recursiveNode = new RecursiveNode(
            this.runner,
            this.chooser,
            this.choiceName,
            this,
            this.children,
            this.matcher,
            this.commands,
            this.accumulatorName,
            this.initialAccumulator,
            this.stopCondition
        )
		
		recursiveNode.resolve(parameters)
    }
}

module.exports = {
    RecursiveNode
}