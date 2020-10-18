class ExactMatcher {
	constructor(name, haystack){
		this.haystack = haystack;
		this.name = name
	}

	match(params){
		return this.haystack.includes(params[this.name]);
	}
}

module.exports = {
	ExactMatcher
}
