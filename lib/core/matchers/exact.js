class ExactMatcher {
    constructor(haystack){
        this.haystack = haystack;
    }

    match(needle){
        return this.haystack.includes(needle);
    }
}

module.exports = {
    ExactMatcher
}