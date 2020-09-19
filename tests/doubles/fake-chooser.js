const OptionChoice = require('../../lib/core/choices/option-choice.js').OptionChoice

class FakeChooser {
    constructor(choiceToMake){
        this.choice = choiceToMake;
    }

    chooseFrom(options){
        return new OptionChoice(this.choice);
    }
}

module.exports = {
    FakeChooser
}