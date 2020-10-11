const { OptionChoice } = require('./option-choice');

class ScriptedChooser {
    constructor(choicesToMake, delegatedChooser){
        this.delegatedChooser = delegatedChooser;
        this.choicesToMake = choicesToMake;
    }

    chooseFrom(options, previousChoices){
        if (this.choicesToMake.length > 0){
            return new OptionChoice(this.choicesToMake.shift());
        }

        return this.delegatedChooser.chooseFrom(options, previousChoices)
    }
}

module.exports = {
    ScriptedChooser
}