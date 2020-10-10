const { OptionChoice } = require("../choices/option-choice");
const { ExitChoice } = require("../choices/exit-choice");
const { GoBackChoice } = require("../choices/go-back-choice");

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
		const choiceMade = this.makeAChoice(options, previousChoices);

		if (choiceMade instanceof ExitChoice) { this.runner.quitProgram(); return };
		if (choiceMade instanceof GoBackChoice) { 
			!this.parentNode 
				? this.runner.quitProgram() 
				: this.parentNode.resolve(parameters, previousChoices.slice(0,-1)); return 
		}

		const filteredChoice = new OptionChoice(this.applyFilters(choiceMade.name));
		
		if (this.shouldReturnSomething()){ 
			parameters = {...parameters, [this.choiceName]: filteredChoice.name} 
		};

		previousChoices = [...previousChoices, filteredChoice.name];
		this.passToTheNextNode(choiceMade, parameters, previousChoices);
	}

	shouldReturnSomething(){
		return this.choiceName
	}

	addParameter(parameters, choiceMade){
		return {
			...parameters, 
			[this.choiceName]: this.applyFilters(choiceMade.name) 
		}
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

		if( ! nextNode){
			console.error(
`Sorry! 
No action available for the selected item: "${choice.name}"`
			);
			return this.runner.quitProgram(1);
		}

		nextNode.resolve(parameters, previousChoices);
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