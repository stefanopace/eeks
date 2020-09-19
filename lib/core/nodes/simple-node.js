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
		const options = this.generateOptions();
		const choiceMade = this.makeAChoice(options);
		if (this.choiceName) {
			parameters = {parameters, [this.choiceName]: choiceMade}
		}
		if (choiceMade.exit()) { process.exit(0) };
		this.passToTheNextNode(choiceMade, parameters);
	}

	generateOptions() {
		return [];
	}

	makeAChoice(options) {
		return this.chooser.chooseFrom(options);
	}

	passToTheNextNode(choice, parameters) {
		if (choice.goBack()) {
			this.parentNode.resolve(parameters);
			return;
		}

		this.children.find(child => child.canResolve(choice)).resolve(parameters);
	}

	canResolve(choice) {
		return this.matcher.match(choice);
	}
}

module.exports = {
	SimpleNode
}