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

	passToTheNextNode(choice, parameters, previousChoices){
		const statusCode = this.runner.statusCodeIsOk(this.stopCondition, parameters)
		
		if (statusCode instanceof RuntimeError) {
			return statusCode.addTrace('Checking stop condition of recursive node')
		}

		if (statusCode){
			return super.passToTheNextNode(choice, parameters, previousChoices)
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
	}

	addParametersFromChoice(parameters, choice){
		return this.accumulator.set(
			super.addParametersFromChoice(parameters, choice), 
			choice.name);
	}

	removeParametersFromPreviousNode(parameters) {
		return {
			...parameters, 
			[this.accumulator.name]: parameters[this.accumulator.name].slice(0, -1)
		}
	}

	setInitalParameters(parameters){
		return this.accumulator.setInitial(parameters);
	}
}

module.exports = {
	RecursiveNode
}
