const { spawnSync } = require('child_process');

class SystemRunner {
    constructor(){}

    substituteParams(commandToExecute, parameters){
        return commandToExecute.map((command) => {
            Object.entries(parameters).forEach(([name, value]) => {
                command = command.replace(`{${name}}`, '"' + value + '"');
            });
            
            return command;
        })
    }

    runAndShowOutput(commandToExecute, parameters){
        const commands = this.substituteParams(commandToExecute, parameters);
        spawnSync('sh', ['-c', commands.join(';') ], { 
            stdio: 'inherit',
            encoding: 'utf-8'
        });
    }

    execAndGetOutputAsArray(commandToExecute, parameters){
        const commands = this.substituteParams(commandToExecute, parameters);
        const result = spawnSync('sh', ['-c', commands.join(';') ], { 
            stdio: 'pipe',
            encoding: 'utf-8'
        });

        return result.stdout.trim().split('\n');
    }
}

module.exports = {
    SystemRunner
}