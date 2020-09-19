class SimpleNode {
	constructor(commandRunner, chooser, choiceName, parentNode, children, matcher){
		this.runner = commandRunner;
		this.chooser = chooser;
		this.choiceName = choiceName;
		this.parentNode = parentNode;
		this.children = children;
		this.matcher = matcher;
	}

	resolve(parameters) {
		const options = this.generateOptions(parameters);
		const choiceMade = this.makeAChoice(options);

		if (choiceMade.exit()) { process.exit(0) };

		if (this.choiceName) {
			parameters = {...parameters, [this.choiceName]: choiceMade.name}
		}
		
		this.passToTheNextNode(choiceMade, parameters);
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
				process.exit(0);
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
			process.exit(1);
		}

		nextNode.resolve(parameters);
	}

	canResolve(choice) {
		return this.matcher.match(choice);
	}
}

module.exports = {
	SimpleNode
}