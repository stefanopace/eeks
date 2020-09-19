const { spawnSync } = require('child_process');

class SystemRunner {
    constructor(){}

    run(commandToExecute, parameters){
        const result = spawnSync('sh', ['-c', commandToExecute.join(';') ], { 
            stdio: 'inherit',
            encoding: 'utf-8'
        });
    }
}

module.exports = {
    SystemRunner
}