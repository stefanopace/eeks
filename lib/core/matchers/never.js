class NeverMatcher {
    constructor(){}

    match(needle){
        return false;
    }
}

module.exports = {
    NeverMatcher
}