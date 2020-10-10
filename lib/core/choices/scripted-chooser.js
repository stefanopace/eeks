const { OptionChoice } = require('./option-choice.js');

class ScriptedChooser {
    constructor(choicesToMake, delegatedChooser){
        this.delegatedChooser = delegatedChooser;
        this.choicesToMake = choicesToMake;
    }

    chooseFrom(options){
        if (this.choicesToMake.length > 0){
            return new OptionChoice(this.choicesToMake.shift());
        }

        return this.delegatedChooser.chooseFrom(options)
    }
}

module.exports = {
    ScriptedChooser
}