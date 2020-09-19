class SpyRunner {
    constructor(){}

    run(commandToExecute, parameters){
        this.executedCommand = commandToExecute;
        this.parameters = parameters
    }
}

module.exports = {
    SpyRunner
}