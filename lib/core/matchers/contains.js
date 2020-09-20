class ContainsMatcher {
    constructor(needles){
        this.needles = needles;
    }

    match(haystack){
        return this.needles.some((needle) => haystack.name.includes(needle));
    }
}

module.exports = {
    ContainsMatcher
}