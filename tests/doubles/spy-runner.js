class SpyRunner {
    constructor(){}

    runAndShowOutput(commandToExecute, parameters){
        this.executedCommand = commandToExecute;
        this.parameters = parameters;
    }
}

module.exports = {
    SpyRunner
}