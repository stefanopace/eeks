const { ExitChoice } = require('../choices/exit-choice.js');
const { GoBackChoice } = require('../choices/go-back-choice.js');
const { OptionChoice } = require('../choices/option-choice.js');
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
        stopCondition,
        filters
    ) {
        super(runner, chooser, choiceName, parentNode, children, matchers, filters);
        this.commands = commands;
        this.accumulatorName = accumulatorName;
        this.initialAccumulator = initialAccumulator;
        this.stopCondition = stopCondition;
	}

	generateOptions(parameters) {
		return this.runner.execAndGetOutputAsArray(this.commands, parameters);
	}
    
    resolve(parameters={}, previousChoices=[]){
        parameters = {
            ...parameters, 
            [this.accumulatorName]: parameters[this.accumulatorName] ? parameters[this.accumulatorName] : [this.initialAccumulator]
        }
        const options = this.generateOptions(parameters);
		const choiceMade = this.makeAChoice(options, previousChoices);

		if (choiceMade instanceof ExitChoice) { this.runner.quitProgram(); return; };

        if (choiceMade instanceof GoBackChoice) {
            parameters = {
                ...parameters, 
                [this.accumulatorName]: parameters[this.accumulatorName].slice(0, -1)
            }
            !this.parentNode 
				? this.runner.quitProgram() 
				: this.parentNode.resolve(parameters, previousChoices.slice(0,-1)); return 
        }

        const filteredChoice = new OptionChoice(this.applyFilters(choiceMade.name));

		if (this.shouldReturnSomething()) {
			parameters = {...parameters, [this.choiceName]: filteredChoice.name}
        }
        
        if (this.accumulatorName) {
            parameters = {
                ...parameters, 
                [this.accumulatorName]: [...(parameters[this.accumulatorName]), filteredChoice.name]
            }
        }

		previousChoices = [...previousChoices, filteredChoice.name];

        if (this.runner.statusCodeIsOk(this.stopCondition, parameters)){
            this.passToTheNextNode(filteredChoice, parameters, previousChoices);
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
            this.stopCondition,
            this.filters
        )
        
		recursiveNode.resolve(parameters, previousChoices)
    }
}

module.exports = {
    RecursiveNode
}