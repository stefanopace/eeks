const { spawnSync } = require('child_process');

class SystemRunner {
    constructor(){}

    substituteParams(commandToExecute, parameters){
        return commandToExecute.map((command) => {
            Object.entries(parameters).forEach(([name, value]) => {
                if (Array.isArray(value)) {value = value.join(' ')}
                command = command.replace(`{${name}}`, '"' + value + '"');
            });
            
            return command;
        })
    }

    quitProgram(exitCode=0){
        spawnSync('tput', ['ed'], {stdio: 'inherit'});
        process.exit(exitCode);
    }

    runAndShowOutput(commandToExecute, parameters){
        spawnSync('tput', ['ed'], {stdio: 'inherit'});
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

    statusCodeIsOk(commandToExecute, parameters){
        const commands = this.substituteParams(commandToExecute, parameters);
        const result = spawnSync('sh', ['-c', commands.join(';') ], { 
            stdio: 'pipe',
            encoding: 'utf-8'
        });

        return result.status === 0;
    }
}

module.exports = {
    SystemRunner
}