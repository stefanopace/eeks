class ContainsMatcher {
	constructor(name, needle){
		this.needles = needle;
		this.name = name;
	}

	match(params){
		return params[this.name].includes(this.needle);
	}
}

module.exports = {
	ContainsMatcher
}
