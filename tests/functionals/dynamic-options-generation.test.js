const automenu = require('../../lib/core/automenu.js');
const { FakeChooser } = require('../doubles/fake-chooser.js');
const { SpyRunner } = require('../doubles/spy-runner.js');
const { OptionChoice } = require('../../lib/core/choices/option-choice.js');
const { GoBackChoice } = require('../../lib/core/choices/go-back-choice.js');
const { ExitChoice } = require('../../lib/core/choices/exit-choice.js');
const configProvider = require('../configurations/provider.js');

describe('Dynamic generation', () => {
    test('Call commands for options generation', () => {
        const chooser = new FakeChooser([
            new OptionChoice("stefano")
        ]);
    
        const runner = new SpyRunner();
    
        automenu.execute(configProvider.simpleDynamicMenu, runner, chooser);
        
        expect(runner.commandHistory[0].command).toEqual(['ls']);
        expect(runner.commandHistory[0].parameters).toEqual({});
        expect(runner.commandHistory[0].type).toBe('generate-options');

        expect(runner.commandHistory[1].command).toEqual(['echo {path}']);
        expect(runner.commandHistory[1].parameters).toEqual({path: 'stefano'});
        expect(runner.commandHistory[1].type).toBe('run-and-show');
    });
});
