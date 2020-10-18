class CommandFilter{
	constructor(commands, placeholder, runner, debug){
		this.commands = commands;
		this.runner = runner;
		this.placeholder = placeholder;
		this.debugger = debug;
	}

	apply(string, parameters) {
		this.debugger.log(`Applying filter trough command`);
		this.debugger.logBold(`text to filter: ${string}`);
		this.debugger.log(`commands: ${this.commands}`);

		const result = this.runner.execAndGetOutputAsArray(
			commandToExecute, 
			{
				...parameters,
				[this.placeholder]: string
			}
		)

		this.debugger.logBold(`result: ${result}`);

		return result.join(' ');
	}
}

module.exports = {
	RegexFilter
}
