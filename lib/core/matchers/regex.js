class RegexMatcher {
	constructor(name, regex){
		this.regex = new RegExp(regex);
		this.name = name
	}

	match(params){
		return this.regex.test(params[this.name]);
	}
}

module.exports = {
	RegexMatcher
}
