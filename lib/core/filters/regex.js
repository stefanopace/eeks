class RegexFilter{
	constructor(regex, substitution, debug){
		this.regex = regex;
		this.substitution = substitution;
		this.debugger = debug;
	}

	apply(string) {
		this.debugger.log(`Applying regex filter`);
		this.debugger.logBold(`text to filter: ${string}`);
		this.debugger.log(`regex: ${this.regex}`);
		this.debugger.log(`substitution: ${this.substitution}`);

		const result = string.replace(new RegExp(this.regex), this.substitution);

		this.debugger.logBold(`result: ${result}`);

		return result;
	}
}

module.exports = {
	RegexFilter
}
