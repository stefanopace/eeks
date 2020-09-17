class simpleNode {
	constructor(chooser, parentNode, children){
		this.chooser = chooser;
		this.parentNode = parentNode;
		this.children = children;
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

	canResolve() {
		return false;
	}

	makeAChoice(options) {
		return chooser.chooseFrom(options);
	}

	passToTheNextNode(choice) {
		if (choice.goBack()) {
			this.parentNode.resolve();
			return;
		}

		this.children.find(child => child.canResolve(choosenOption)).resolve();
	}
}