const { Ok } = require('../core/results/ok');
const { RuntimeError } = require('../core/results/runtime-error');
const { spawnSync } = require('child_process');

class SystemRunner {
	constructor(sourceFiles){
		this.sourceFiles = sourceFiles || []
	}

	substituteParams(commandToExecute, parameters){
		return commandToExecute.map((command) => {
			Object.entries(parameters).forEach(([name, value]) => {
				if (Array.isArray(value)) {value = value.join(' ')}
				command = command.replace(`{${name}}`, '"' + value + '"');
			});
			
			return command;
		})
	}

	clearScreen(){
		spawnSync('tput', ['ed'], {stdio: 'inherit'});
	}

	sourceFilesAndJoinCommand(command) {
		const sourced = this.sourceFiles.map(source => `. ${source}`).join(';');
		return sourced ? [sourced, command].join(';') : command
	}

	runAndShowOutput(commandToExecute, parameters){
		spawnSync('tput', ['ed'], {stdio: 'inherit'});
		const command = 
			this.sourceFilesAndJoinCommand(
				this.substituteParams(commandToExecute, parameters).join(';')
			);
		
		const result = 
			spawnSync('sh', ['-c', command ], {
				stdio: 'inherit',
				encoding: 'utf-8'
			});

		const trace = `executed command: [${command}]`
		if (result.status != 0) { 
			return (new RuntimeError())
			.addTrace(`the command exited with status: [${result.status}]`) 
			.addTrace(trace)
		}
		
		return (new Ok()).addTrace(trace);
	}

	execAndGetOutputAsArray(commandToExecute, parameters){
		const command = 
			this.sourceFilesAndJoinCommand(
				this.substituteParams(commandToExecute, parameters).join(';')
			);
		
		const result = spawnSync('sh', ['-c', command ], { 
			stdio: 'pipe',
			encoding: 'utf-8'
		});

		const trace = `executed command: [${command}]`
		if (result.status != 0) { 
			return (new RuntimeError())
			.addTrace(`the command exited with status: [${result.status}] with message: [\n${result.stderr}\n]`)
			.addTrace(trace) 
		}

		return result.stdout.trim().split('\n');
	}

	statusCodeIsOk(commandToExecute, parameters){
		const command = 
			this.sourceFilesAndJoinCommand(
				this.substituteParams(commandToExecute, parameters).join(';')
			);

		const result = spawnSync('sh', ['-c', command ], { 
			stdio: 'pipe',
			encoding: 'utf-8'
		});

		return result.status === 0;
	}
}

module.exports = {
	SystemRunner
}
