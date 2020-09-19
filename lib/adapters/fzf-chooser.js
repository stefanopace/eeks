const { OptionChoice } = require('../../lib/core/choices/option-choice.js');
const { GoBackChoice } = require('../../lib/core/choices/go-back-choice.js');
const { ExitChoice } = require('../../lib/core/choices/exit-choice.js');

const { spawnSync } = require('child_process');

class FzfChooser {
    constructor(){}

    chooseFrom(options){
        const result = spawnSync('fzf', [], { 
            stdio: ['pipe', 'pipe', 'inherit'],
            input: options.join('\n'),
            encoding: 'utf-8'
        });
        const choice = result.stdout.trim();
        if (!choice){
            return new ExitChoice();
        }
        return new OptionChoice(choice);
    }
}

module.exports = {
    FzfChooser
}