const { ExitChoice } = require('../choices/exit-choice');
const { GoBackChoice } = require('../choices/go-back-choice');
const { OptionChoice } = require('../choices/option-choice');
const { SimpleNode } = require('./simple-node');
const { EarlyExit } = require("../results/early-exit");
const { RuntimeError } = require("../results/runtime-error");

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
		if (options instanceof RuntimeError) { 
			return options
				.addTrace(`Generating options for: [${previousChoices.slice(-1)[0] || "entry point"}]`)
		}
		
		const choiceMade = this.makeAChoice(options, previousChoices);
		if (choiceMade instanceof RuntimeError) { 
			return choiceMade
				.addTrace(`Selecting an item for: [${previousChoices.slice(-1)[0] || "entry point"}]`)
				.addTrace(`Options generated: [\n\t${options.join('\n\t')}\n]`);
		}
		if (choiceMade instanceof ExitChoice) { return new EarlyExit() };
		if (choiceMade instanceof GoBackChoice) {
			parameters = {
				...parameters, 
				[this.accumulatorName]: parameters[this.accumulatorName].slice(0, -1)
			}
			return (!this.parentNode 
				? new EarlyExit() 
				: this.parentNode.resolve(parameters, previousChoices.slice(0,-1))
			).addTrace(`Navigated back`);
		}

		const filteredOutput = this.applyFilters(choiceMade.name);
		if (filteredOutput instanceof RuntimeError) { return filteredOutput }

		const filteredChoice = new OptionChoice(this.applyFilters(filteredOutput));

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
			return this.passToTheNextNode(filteredChoice, parameters, previousChoices)
				.addTrace(`The selected item was: [${filteredChoice.name}]`)
				.addTrace(`Options generated: [\n\t${options.join('\n\t')}\n]`);
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
		
		return recursiveNode.resolve(parameters, previousChoices)
			.addTrace(`The selected item was: [${filteredChoice.name}]`)
			.addTrace(`Options generated: [\n\t${options.join('\n\t')}\n]`);
	}
}

module.exports = {
	RecursiveNode
}