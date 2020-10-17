const chalk = require('chalk');
const { spawnSync } = require('child_process');

class Debugger {
	constructor(enabled){
		this.enabled = enabled || true;
	}

	log(text){
		if (!this.enabled) return;
		this.clearScreen();

		console.debug(text)
	}

	logBold(text){
		if (!this.enabled) return;
		this.clearScreen();

		console.debug(chalk.bold(text))
	}

	clearScreen(){
		spawnSync('tput', ['ed'], {stdio: 'inherit'});
	}
}


module.exports = {
	Debugger
}
