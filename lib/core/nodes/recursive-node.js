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
		setters,
		parentNode,
		children,
		matchers,
		commands,
		accumulator,
		stopCondition,
	) {
		super(runner, chooser, setters, parentNode, children, matchers);
		this.commands = commands;
		this.accumulator = accumulator;
		this.stopCondition = stopCondition;
	}

	generateOptions(parameters) {
		return this.runner.execAndGetOutputAsArray(this.commands, parameters);
	}
	
	resolve(parameters={}, previousChoices=[]){
		parameters = this.accumulator.setInitial(parameters);

		const options = this.generateOptions(parameters);
		if (options instanceof RuntimeError) { 
			return options
				.addTrace(`Generating options for: [${previousChoices.slice(-1)[0] || "entry point"}]`)
		}
		
		if (options.length === 0) {
			return new RuntimeError().addTrace('The command generated no options!')
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
				[this.accumulator.name]: parameters[this.accumulator.name].slice(0, -1)
			}
			return (!this.parentNode 
				? new EarlyExit() 
				: this.parentNode.resolve(parameters, previousChoices.slice(0,-1))
			).addTrace(`Navigated back`);
		}

		parameters = {
			...parameters, 
			...this.setters.reduce((acc, setter) => {
				return {
					...acc,
					...setter.parse(choiceMade.name)
				}
			}, {})
		}

		parameters = this.accumulator.set(parameters, choiceMade.name);

		previousChoices = [...previousChoices, choiceMade.name];

		const statusCode = this.runner.statusCodeIsOk(this.stopCondition, parameters)
		
		if (statusCode instanceof RuntimeError) {
			return statusCode.addTrace('Checking stop condition of recursive node')
		}

		if (statusCode){
			return this.passToTheNextNode(choiceMade, parameters, previousChoices)
				.addTrace(`The selected item was: [${choiceMade.name}]`)
				.addTrace(`Options generated: [\n\t${options.join('\n\t')}\n]`);
		}

		const recursiveNode = new RecursiveNode(
			this.runner,
			this.chooser,
			this.setters,
			this,
			this.children,
			this.matcher,
			this.commands,
			this.accumulator,
			this.stopCondition
		)
		
		return recursiveNode.resolve(parameters, previousChoices)
			.addTrace(`The selected item was: [${choiceMade.name}]`)
			.addTrace(`Options generated: [\n\t${options.join('\n\t')}\n]`);
	}
}

module.exports = {
	RecursiveNode
}
