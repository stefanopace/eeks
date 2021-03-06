const { Ok } = require("../../lib/core/results/ok");

class SpyRunner {
	constructor(){
		this.commandHistory = [];
	}

	runAndShowOutput(commandToExecute, parameters){
		this.commandHistory.push({
			command: commandToExecute,
			parameters: parameters,
			type: 'run-and-show'
		});

		return new Ok();
	}

	execAndGetOutputAsArray(commandToExecute, parameters){
		this.commandHistory.push({
			command: commandToExecute,
			parameters: parameters,
			type: 'generate-options'
		});
		return ['fake option'];
	}

	statusCodeIsOk(commandToExecute, parameters){
		this.commandHistory.push({
			command: commandToExecute,
			parameters: parameters,
			type: 'check-stop-condition'
		});
		return parameters.acc.slice(-1)[0] === 'stop';
	}
}

module.exports = {
	SpyRunner
}
