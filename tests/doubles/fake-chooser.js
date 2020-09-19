class FakeChooser {
    constructor(choiceToMake){
        this.choice = choiceToMake;
    }

    chooserFrom(options){
        return this.choice;
    }
}

module.exports = {
    FakeChooser
}