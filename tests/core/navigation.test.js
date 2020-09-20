const { LeafNode } = require('../../lib/core/nodes/leaf-node.js');
const { ListNode } = require('../../lib/core/nodes/list-node.js');
const { ExactMatcher } = require('../../lib/core/matchers/exact.js');
const { AlwaysMatcher } = require('../../lib/core/matchers/always.js');

const { FakeChooser } = require('../doubles/simple-fake-chooser.js');
const { SpyRunner } = require('../doubles/spy-runner.js');

test('Can navigate a simple menu', () => {
    const runner = new SpyRunner();
    const commandToExecute = "command for cats and bananas";

    const rootNode = new ListNode(
        runner,
        new FakeChooser("cat"),
        null,
        null,
        undefined,
        [new AlwaysMatcher()],
        ["dog", "cat", "banana"]
    );

    const children = [
        new LeafNode(
            runner,
            rootNode,
            [new ExactMatcher(["dog"])],
            ["fake command for dog"]
        ),
        new LeafNode(
            runner,
            rootNode,
            [new ExactMatcher(["cat", "banana"])],
            commandToExecute
        )
    ]

    rootNode.children = children;

    rootNode.resolve({});
    expect(runner.commandHistory[0]).toEqual({
        "command": "command for cats and bananas", 
        "parameters": {}, 
        "type": "run-and-show"
    });
});


test('Can pass parameters trough nodes', () => {
    const runner = new SpyRunner();
    const commandToExecute = "{language} {opinion}";
    const rootNode = new ListNode(
        runner,
        new FakeChooser("elixir"),
        "language",
        null,
        undefined,
        [new AlwaysMatcher()],
        ["python", "javascript", "php", "elixir"]
    );

    const children = [
        new ListNode(
            runner,
            new FakeChooser("is great"),
            "opinion",
            rootNode,
            undefined,
            [new AlwaysMatcher()],
            ["is great", "sucks"]
        )
    ]

    const nepotes = [
        new LeafNode(
            runner,
            children[0],
            [new AlwaysMatcher()],
            commandToExecute
        )
    ]
    
    children[0].children = nepotes;
    rootNode.children = children;

    rootNode.resolve();
    expect(runner.commandHistory[0]).toEqual( {
            "command": "{language} {opinion}", 
            "parameters": {"language": "elixir", "opinion": "is great"}, 
            "type": "run-and-show"
    } );
});