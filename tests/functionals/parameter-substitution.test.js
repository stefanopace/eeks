const automenu = require('../../lib/core/automenu');
const { FakeChooser } = require('../doubles/fake-chooser');
const { SpyRunner } = require('../doubles/spy-runner');
const { OptionChoice } = require('../../lib/core/choices/option-choice');
const { GoBackChoice } = require('../../lib/core/choices/go-back-choice');
const { ExitChoice } = require('../../lib/core/choices/exit-choice');
const configProvider = require('../configurations/provider');

describe('Parameter substitution', () => {
	test('Can pass params trough simple menu', () => {
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
