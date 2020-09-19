class SimpleNode {
	constructor(commandRunner, chooser, parentNode, children, matcher){
		this.runner = commandRunner;
		this.chooser = chooser;
		this.parentNode = parentNode;
		this.children = children;
		this.matcher = matcher;
	}

	resolve() {
		const options = this.generateOptions();
		const choiceMade = this.makeAChoice(options);
		if (choiceMade.exit()) { process.exit(0) };
		this.passToTheNextNode(choiceMade);
	}

	generateOptions() {
		return [];
	}

	makeAChoice(options) {
		return this.chooser.chooseFrom(options);
	}

	passToTheNextNode(choice) {
		if (choice.goBack()) {
			this.parentNode.resolve();
			return;
		}

		this.children.find(child => child.canResolve(choice)).resolve();
	}

	canResolve(choice) {
		return this.matcher.match(choice);
	}
}

module.exports = {
	SimpleNode
}