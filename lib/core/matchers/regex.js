class RegexMatcher {
    constructor(regexes){
        this.regexes = regexes.map(re => new RegExp(re));
    }

    match(choice){
        return this.regexes.some((regex) => regex.test(choice.name));
    }
}

module.exports = {
    RegexMatcher
}