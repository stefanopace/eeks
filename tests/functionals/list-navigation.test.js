const automenu = require('../../lib/core/automenu');
const { FakeChooser } = require('../doubles/fake-chooser');
const { SpyRunner } = require('../doubles/spy-runner');
const { OptionChoice } = require('../../lib/core/choices/option-choice');
const { GoBackChoice } = require('../../lib/core/choices/go-back-choice');
const { ExitChoice } = require('../../lib/core/choices/exit-choice');
const { EarlyExit } = require('../../lib/core/results/early-exit');
const configProvider = require('../configurations/provider');

describe('Navigation into simple menu', () => {
	test('Can navigate trough all menu', () => {
		const chooser = new FakeChooser([
			new OptionChoice("Hello"),
			new OptionChoice("World")
		]);
	
		const runner = new SpyRunner();
	
		automenu.execute(configProvider.simpleListMenu, runner, chooser);
	
		expect(runner.commandHistory[0].command).toEqual(['echo Hello World!']);
		expect(runner.commandHistory[0].parameters).toEqual({action: 'Hello', name: 'World'});
		expect(runner.commandHistory[0].type).toBe('run-and-show');
	});
	
	test('Can go back to change choice', () => {
		const chooser = new FakeChooser([
			new OptionChoice("Hello"),
			new GoBackChoice(),
			new OptionChoice("Exit")
		]);
	
		const runner = new SpyRunner();
	
		automenu.execute(configProvider.simpleListMenu, runner, chooser);
	
		expect(runner.commandHistory[0].command).toEqual(['echo "Bye!"']);
		expect(runner.commandHistory[0].parameters).toEqual({action: 'Exit'});
		expect(runner.commandHistory[0].type).toBe('run-and-show');
	});

	test('Can exit without executing commands', () => {
		const chooser = new FakeChooser([
			new OptionChoice("Hello"),
			new ExitChoice()
		]);
	
		const runner = new SpyRunner();
	
		const result = automenu.execute(configProvider.simpleListMenu, runner, chooser);
		
		expect(result).toBeInstanceOf(EarlyExit);
		expect(runner.commandHistory.length).toBe(0);
	});
});
