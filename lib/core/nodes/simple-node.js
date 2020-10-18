const { OptionChoice } = require("../choices/option-choice");
const { ExitChoice } = require("../choices/exit-choice");
const { GoBackChoice } = require("../choices/go-back-choice");
const { EarlyExit } = require("../results/early-exit");
const { RuntimeError } = require("../results/runtime-error");
const { MissingElegibleResolver } = require("../results/missing-elegible-resolver");

class SimpleNode {
	constructor(commandRunner, chooser, setters, parentNode, children, matchers, filters){
		this.runner = commandRunner;
		this.chooser = chooser;
		this.setters = setters;
		this.parentNode = parentNode;
		this.children = children;
		this.matchers = matchers;
		this.filters = filters || []
	}

	resolve(parameters={}, previousChoices=[]) {
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
			return (!this.parentNode 
				? new EarlyExit() 
				: this.parentNode.resolve(parameters, previousChoices.slice(0,-1))
			).addTrace(`Navigated back`);
		}

		const filteredOutput = this.applyFilters(choiceMade.name);
		if (filteredOutput instanceof RuntimeError) { return filteredOutput }
		
		const filteredChoice = new OptionChoice(filteredOutput);
		
		if (this.shouldSetSomething()){ 
			parameters = {...parameters, [this.setters[0].name]: filteredChoice.name} 
		};

		previousChoices = [...previousChoices, filteredChoice.name];
		
		return this.passToTheNextNode(filteredChoice, parameters, previousChoices)
			.addTrace(`The selected item was: [${filteredChoice.name}]`)
			.addTrace(`Options generated: [\n\t${options.join('\n\t')}\n]`);
	}

	shouldSetSomething(){
		return this.setters.length > 0
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

		if( ! nextNode){ return (new MissingElegibleResolver())
			.addTrace(`Cannot find an action for: [${choice.name}]`);
		}
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
