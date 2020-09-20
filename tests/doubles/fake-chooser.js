const { ExitChoice } = require('../../lib/core/choices/exit-choice.js')

class FakeChooser {
    constructor(choicesToMake){
        this.choicesToMake = choicesToMake;
    }

    chooseFrom(options){
        if (this.choicesToMake.length === 0) 
            return new ExitChoice();

        return this.choicesToMake.shift();
    }
}

module.exports = {
    FakeChooser
}