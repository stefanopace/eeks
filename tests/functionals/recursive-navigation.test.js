const automenu = require('../../lib/core/automenu.js');
const { FakeChooser } = require('../doubles/fake-chooser.js');
const { SpyRunner } = require('../doubles/spy-runner.js');
const { OptionChoice } = require('../../lib/core/choices/option-choice.js');
const { GoBackChoice } = require('../../lib/core/choices/go-back-choice.js');
const { ExitChoice } = require('../../lib/core/choices/exit-choice.js');
const configProvider = require('../configurations/provider.js');

describe('Navigation into recursive node', () => {
    test('Can navigate recursive node', () => {
        const chooser = new FakeChooser([
            new OptionChoice("something"),
            new OptionChoice("something"),
            new OptionChoice("something"),
            new OptionChoice("stop"),
        ]);
    
        const runner = new SpyRunner();
    
        automenu.execute(configProvider.simpleRecursive, runner, chooser);
        console.log(runner.commandHistory);
        expect(runner.commandHistory.slice(-1)[0].command).toEqual(['you stopped recursion!'])
    });
});
