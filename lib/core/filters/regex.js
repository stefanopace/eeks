class RegexFilter{
    constructor(regex, substitution){
        this.regex = regex;
        this.substitution = substitution;
    }

	apply(string) {
        return string.replace(new RegExp(this.regex), this.substitution);
	}
}

module.exports = {
	RegexFilter
}