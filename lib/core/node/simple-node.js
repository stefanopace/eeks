class simpleNode {
	constructor(chooser, optionsList, parentNode, children){
		this.chooser = chooser;
		this.optionsList = optionsList;
		this.parentNode = parentNode;
		this.children = children;
	}

	resolve() {
		const choice = chooser.chooseFrom(this.optionsList);
		if (choice.goBack()) {
			this.parentNode.resolve();
			return;
		}
		if (choice.exit()){}
		this.children.find(child => child.canResolve(choosenOption)).resolve();
	}
}