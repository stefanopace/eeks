class Accumulator {
	constructor(name, filters, initial){
		this.name = name;
		this.filters = filters;
		this.initial = initial;
	}

	set(parameters, text){
		return {
			...parameters, 
			[this.name]: 
				[
					...(parameters[this.name]), 
					this.filters.reduce((acc, filter) => filter.apply(acc), text)
				]
		}

		return { [this.name]: this.filters.reduce((acc, filter) => filter.apply(acc), text) };
	}

	setInitial(parameters){
		return {
			...parameters, 
			[this.name]: parameters[this.name] ? parameters[this.name] : [this.initial]
		}
	}
}

module.exports = {
	Accumulator
}
