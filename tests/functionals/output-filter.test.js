const automenu = require('../../lib/core/automenu');
const { FakeChooser } = require('../doubles/fake-chooser');
const { SpyRunner } = require('../doubles/spy-runner');
const { OptionChoice } = require('../../lib/core/choices/option-choice');
const { GoBackChoice } = require('../../lib/core/choices/go-back-choice');
const { ExitChoice } = require('../../lib/core/choices/exit-choice');
const configProvider = require('../configurations/provider');

describe('Output filter', () => {
	test('Can filter choosen option to extract parameter', () => {

		const chooser = new FakeChooser([
			new OptionChoice("1234_Stefano 2020-08-10")
		]);
	
		const runner = new SpyRunner();
	
		automenu.execute(configProvider.simpleListWithOutputFilter, runner, chooser);
		
		expect(runner.commandHistory[0].parameters).toEqual(
			{"name": "Stefano"}
		);
	});
});
