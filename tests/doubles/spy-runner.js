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
    }

    quitProgram(){
        this.commandHistory.push({
            command: null,
            parameters: null,
            type: 'quit-program'
        });
    }

    execAndGetOutputAsArray(commandToExecute, parameters){
        this.commandHistory.push({
            command: commandToExecute,
            parameters: parameters,
            type: 'generate-options'
        });
        return [];
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