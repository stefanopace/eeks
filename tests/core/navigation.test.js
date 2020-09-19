const LeafNode = require('../../lib/core/nodes/leaf-node.js').LeafNode;
const ListNode = require('../../lib/core/nodes/list-node.js').ListNode;
const ExactMatcher = require('../../lib/core/matchers/exact.js').ExactMatcher;
const AlwaysMatcher = require('../../lib/core/matchers/always.js').AlwaysMatcher;

const FakeChooser = require('../doubles/fake-chooser.js').FakeChooser;
const SpyRunner = require('../doubles/spy-runner.js').SpyRunner;
const SpyCommand = require('../doubles/spy-command.js').SpyCommand;

test('Can navigate a simple menu', () => {
    const runner = new SpyRunner();
    const commandToExecute = new SpyCommand("command for cats and bananas");

    const rootNode = new ListNode(
        runner,
        new FakeChooser("cat"),
        null,
        undefined,
        new AlwaysMatcher(),
        ["dog", "cat", "banana"]
    );

    const children = [
        new LeafNode(
            runner,
            rootNode,
            new ExactMatcher(["dog"]),
            new SpyCommand("fake command for dog")
        ),
        new LeafNode(
            runner,
            rootNode,
            new ExactMatcher(["cat", "banana"]),
            commandToExecute
        )
    ]

    rootNode.children = children;

    rootNode.resolve();
    expect(runner.executedCommand).toBe(commandToExecute);
});