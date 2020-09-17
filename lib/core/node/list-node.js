class listNode {
	constructor(chooser, parentNode, children, optionsList){
		super(chooser, parentNode, children)
		this.optionsList = optionsList;
	}

	generateOptions() {
		return this.optionsList;
	}
}