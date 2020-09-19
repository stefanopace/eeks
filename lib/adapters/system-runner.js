const { spawnSync } = require('child_process');

class SystemRunner {
    constructor(){}

    runAndShowOutput(commandToExecute, parameters){
        const result = spawnSync('sh', ['-c', commandToExecute.join(';') ], { 
            stdio: 'inherit',
            encoding: 'utf-8'
        });
    }

    execAndGetOutputAsArray(commandToExecute, parameters){
        const result = spawnSync('sh', ['-c', commandToExecute.join(';') ], { 
            stdio: 'pipe',
            encoding: 'utf-8'
        });

        return result.stdout.trim().split('\n');
    }
}

module.exports = {
    SystemRunner
}