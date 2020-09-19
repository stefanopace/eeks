class SpyRunner {
    constructor(){}

    run(commandToExecute, parameters){
        this.executedCommand = commandToExecute;
        this.parameters = parameters;
        console.log("executing: " + commandToExecute);
        console.log("parameters: " + parameters);
    }
}

module.exports = {
    SpyRunner
}