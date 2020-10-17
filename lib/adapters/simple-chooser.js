const { OptionChoice } = require('../../lib/core/choices/option-choice');
const { GoBackChoice } = require('../../lib/core/choices/go-back-choice');
const { ExitChoice } = require('../../lib/core/choices/exit-choice');

const { spawnSync } = require('child_process');

class SimpleChooser {
	constructor(){}

	askInput(){
		process.stderr.write('> ');

		const result = spawnSync('sh', ['-c', 'read input; echo $input'], { 
			stdio: ['inherit', 'pipe', 'inherit'],
			encoding: 'utf-8'
		});

		return result.stdout.trim().split('\n')[0]
	}

	chooseFrom(options, previousChoices){
		const menu = options.map((option, index) => ({index: index, description: option}));
		
		menu.forEach(entry => process.stderr.write(`${entry.index}: ${entry.description}\n`));
		
		const input = this.askInput();
		
		if (input == 'q' || input == 'exit'){
			return new ExitChoice();
		}

		if (input == 'b' || input == 'back'){
			return new GoBackChoice();
		}

		const choosenOption = menu.find(entry => entry.index == input)

		if (!choosenOption){
			return this.chooseFrom(options, previousChoices);
		}

		return new OptionChoice(choosenOption.description);
	}
}

module.exports = {
	SimpleChooser
}
