class SpyRunner {
    constructor(){}

    run(commandToExecute){
        this.executedCommand = commandToExecute;
    }
}

module.exports = {
    SpyRunner
}