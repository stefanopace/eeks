const { OptionChoice } = require('../../lib/core/choices/option-choice.js');
const { GoBackChoice } = require('../../lib/core/choices/go-back-choice.js');
const { ExitChoice } = require('../../lib/core/choices/exit-choice.js');

const { spawnSync } = require('child_process');

class SimpleChooser {
    constructor(){}

    askInput(){
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        return new Promise((resolve, reject) => {
            readline.question('> ', input => {
                resolve(input);
            });
        });
    }

    chooseFrom(options){
        const menu = options.map((option, index) => ({index: index, description: option}));

        menu.forEach(entry => process.stdout.write(`${entry.index}: ${entry.description}\n`));
        process.stdout.write('> ');

        const result = spawnSync('sh', ['-c', 'read input; echo $input'], { 
            stdio: ['inherit', 'pipe', 'inherit'],
            encoding: 'utf-8'
        });

        const input = result.stdout.trim().split('\n')[0];
        
        if (input == 'q' || input == 'exit'){
            return new ExitChoice();
        }

        if (input == 'b' || input == 'back'){
            return new GoBackChoice();
        }

        const choosenOption = menu.find(entry => entry.index == input)

        if (!choosenOption){
            return this.chooseFrom(options);
        }

        return new OptionChoice(choosenOption.description);
    }
}

module.exports = {
    SimpleChooser
}