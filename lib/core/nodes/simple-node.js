const { OptionChoice } = require("../choices/option-choice");
const { ExitChoice } = require("../choices/exit-choice");
const { GoBackChoice } = require("../choices/go-back-choice");
const { EarlyExit } = require("../results/early-exit");
const { RuntimeError } = require("../results/runtime-error");
const { MissingElegibleResolver } = require("../results/missing-elegible-resolver");

class SimpleNode {
	constructor(commandRunner, chooser, choiceName, parentNode, children, matchers, filters){
		this.runner = commandRunner;
		this.chooser = chooser;
		this.choiceName = choiceName;
		this.parentNode = parentNode;
		this.children = children;
		this.matchers = matchers;
		this.filters = filters || []
	}

	resolve(parameters={}, previousChoices=[]) {
		const options = this.generateOptions(parameters);
		if (options instanceof RuntimeError) {return options}

		const choiceMade = this.makeAChoice(options, previousChoices);
		if (choiceMade instanceof RuntimeError) { return choiceMade }
		if (choiceMade instanceof ExitChoice) { return new EarlyExit() };
		if (choiceMade instanceof GoBackChoice) { 
			return !this.parentNode 
				? new EarlyExit() 
				: this.parentNode.resolve(parameters, previousChoices.slice(0,-1));
		}

		const filteredOutput = this.applyFilters(choiceMade.name);
		if (filteredOutput instanceof RuntimeError) { return filteredOutput }
		
		const filteredChoice = new OptionChoice(filteredOutput);
		
		if (this.shouldReturnSomething()){ 
			parameters = {...parameters, [this.choiceName]: filteredChoice.name} 
		};

		previousChoices = [...previousChoices, filteredChoice.name];
		return this.passToTheNextNode(choiceMade, parameters, previousChoices);
	}

	shouldReturnSomething(){
		return this.choiceName
	}

	applyFilters(string){
		return this.filters.reduce((acc, filter) => filter.apply(acc), string)
	}

	generateOptions(_parameters) {
		return [];
	}

	makeAChoice(options, previousChoices) {
		return this.chooser.chooseFrom(options, previousChoices);
	}

	passToTheNextNode(choice, parameters, previousChoices) {
		const nextNode = this.children.find(child => child.canResolve(choice));

		if( ! nextNode){ return new MissingElegibleResolver(choice)}
		return nextNode.resolve(parameters, previousChoices);
	}

	canResolve(choice) {
		return this.matchers.some((matcher) => {
			return matcher.match(choice)
		});
	}
}

module.exports = {
	SimpleNode
}