const { OptionChoice } = require('../../lib/core/choices/option-choice');
const { GoBackChoice } = require('../../lib/core/choices/go-back-choice');
const { ExitChoice } = require('../../lib/core/choices/exit-choice');
const { SystemRunner } = require('../../lib/adapters/system-runner');

const { spawnSync } = require('child_process');
const { RuntimeError } = require('../core/results/runtime-error');

class FzfChooser {
	constructor(){}

	chooseFrom(options, previousChoices){
		const result = spawnSync(
			'fzf', 
			[
				'--reverse',
				'--height', '15',
				'--border',
				'--expect=alt-bs',
				'--no-clear',
				...(previousChoices.length == 0 ? ['--header=Select an option:'] : ['--header='+previousChoices.join(' -> ')]),
				'--no-info'],
			{
				stdio: ['pipe', 'pipe', 'inherit'],
				input: options.join('\n'),
				encoding: 'utf-8'
			}
		);

		const trace = `executed fzf`
		if (result.status === 130){ return new ExitChoice(); }

		if (result.status === 1){
			return (new RuntimeError())
			.addTrace("the selected option was empty")
			.addTrace(trace);
		}

		if (result.status != 0){ 
			return (new RuntimeError())
			.addTrace(result.stderr)
			.addTrace(trace); 
		}

		const [goBack, choice] = result.stdout.split('\n');
		if (goBack === 'alt-bs'){ return new GoBackChoice(); }

		return new OptionChoice(choice);
	}
}

const fzfIsAvailable = () => {
	const runner = new SystemRunner();
	return runner.statusCodeIsOk(["fzf --version"], {});
}

module.exports = {
	FzfChooser,
	fzfIsAvailable
}
