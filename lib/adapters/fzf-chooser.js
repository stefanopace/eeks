const { OptionChoice } = require('../../lib/core/choices/option-choice.js');
const { GoBackChoice } = require('../../lib/core/choices/go-back-choice.js');
const { ExitChoice } = require('../../lib/core/choices/exit-choice.js');

const { spawnSync } = require('child_process');

class FzfChooser {
    constructor(){}

    chooseFrom(options){
        const result = spawnSync('fzf', ['--reverse', '--height', '15', '--border', '--expect=bs'], { 
            stdio: ['pipe', 'pipe', 'inherit'],
            input: options.join('\n'),
            encoding: 'utf-8'
        });

        const [goBack, choice] = result.stdout.split('\n');

        if (result.status === 130){
            return new ExitChoice();
        }

        if (goBack === 'bs'){
            return new GoBackChoice();
        }

        return new OptionChoice(choice);
    }
}

module.exports = {
    FzfChooser
}