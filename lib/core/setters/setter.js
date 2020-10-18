class Setter {
	constructor(name, filters){
		this.name = name;
		this.filters = filters;
	}

	parse(text){
		return { [this.name]: this.filters.reduce((acc, filter) => filter.apply(acc), text) };
	}
}

module.exports = {
	Setter
}
