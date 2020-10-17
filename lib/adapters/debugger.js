const chalk = require('chalk');
const { spawnSync } = require('child_process');

class Debugger {
	log(text){
		this.clearScreen();
		console.debug(text)
	}

	logBold(text){
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
