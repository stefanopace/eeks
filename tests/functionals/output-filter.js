const automenu = require('../../lib/core/automenu.js');
const { FakeChooser } = require('../doubles/fake-chooser.js');
const { SpyRunner } = require('../doubles/spy-runner.js');
const { OptionChoice } = require('../../lib/core/choices/option-choice.js');
const { GoBackChoice } = require('../../lib/core/choices/go-back-choice.js');
const { ExitChoice } = require('../../lib/core/choices/exit-choice.js');
const configProvider = require('../configurations/provider.js');

describe('Output filter', () => {
    test('Can filter choosen option to extract parameter', () => {
        const chooser = new FakeChooser([
            new OptionChoice("Elixir"),
            new OptionChoice("is awesome")
        ]);
    
        const runner = new SpyRunner();
    
        automenu.execute(configProvider.simpleMenuWithParams, runner, chooser);
        
        expect(runner.commandHistory[0].parameters).toEqual(
            {
                language: 'Elixir', 
                opinion: 'is awesome'
            }
        );
    });
});
