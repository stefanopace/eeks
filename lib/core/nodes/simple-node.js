class SimpleNode {
	constructor(commandRunner, chooser, choiceName, parentNode, children, matchers, filters){
		this.runner = commandRunner;
		this.chooser = chooser;
		this.choiceName = choiceName;
		this.parentNode = parentNode;
		this.children = children;
		this.matchers = matchers;
		this.filters = filters
	}

	resolve(parameters={}) {
		const options = this.generateOptions(parameters);
		const choiceMade = this.makeAChoice(options);

		if (choiceMade.exit()) { return this.runner.quitProgram(); };

		if (this.choiceName) {
			if (this.filters){
				const parameterValue = this.applyFilters(this.filters, choiceMade.name);
				parameters = {...parameters, [this.choiceName]: parameterValue}
			} else {
				const parameterValue = choiceMade.name;
				parameters = {...parameters, [this.choiceName]: parameterValue}
			}
		}

		this.passToTheNextNode(choiceMade, parameters);
	}

	applyFilters(filters, string){
		return filters.reduce((acc, filter) => filter.apply(acc), string)
	}

	generateOptions(_parameters) {
		return [];
	}

	makeAChoice(options) {
		return this.chooser.chooseFrom(options);
	}

	passToTheNextNode(choice, parameters) {
		if (choice.goBack()) {
			if ( ! this.parentNode){
				return this.runner.quitProgram();
			}

			this.parentNode.resolve(parameters);
			return;
		}

		const nextNode = this.children.find(child => child.canResolve(choice));

		if( ! nextNode){
			console.error(
`Sorry! 
No action available for the selected item: "${choice.name}"`
			);
			return this.runner.quitProgram(1);
		}

		nextNode.resolve(parameters);
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