const automenu = require('../../lib/core/automenu.js');
const { ConfigParser } = require('../../lib/adapters/json-parser.js');
const { FakeChooser } = require('../doubles/fake-chooser.js');
const { SpyRunner } = require('../doubles/spy-runner.js');
const { OptionChoice } = require('../../lib/core/choices/option-choice.js');
const { GoBackChoice } = require('../../lib/core/choices/go-back-choice.js');
const { ExitChoice } = require('../../lib/core/choices/exit-choice.js');

test('can navigate a simple menu', () => {
    const config = {
        "type": "list",
        "returns": "action",
        "options": ["Hello", "Exit"],
        "resolvers": [
            {
                "type": "list",
                "returns": "name",
                "match-exact": ["Hello"],
                "options": ["World", "Man", "Pippo", "Johnny"],
                "resolvers": [ {
                        "type": "leaf",
                        "match-exact" : ["World"],
                        "execute": ["echo Hello World!"]
                    },{
                        "type": "leaf",
                        "match-exact" : ["Man"],
                        "execute": ["echo Yo man!"]
                    },{
                        "type": "leaf",
                        "match-exact": ["Johnny"],
                        "execute": ["echo \"Who are you {name}?\""]
                } ]
            },
            {
                "type": "leaf",
                "match-exact": ["Exit"],
                "execute": ["echo \"Bye!\""]
            }
        ]
    };
    
    const chooser = new FakeChooser([
        new OptionChoice("Hello"),
        new OptionChoice("World")
    ]);

    const runner = new SpyRunner();
    const parser = new ConfigParser(runner, chooser);
    const rootNode = parser.parseConfig(config, null);

    automenu.execute(rootNode);

    expect(runner.commandHistory[0].command).toEqual(['echo Hello World!']);
    expect(runner.commandHistory[0].parameters).toEqual({action: 'Hello', name: 'World'});
    expect(runner.commandHistory[0].type).toBe('run-and-show');
});