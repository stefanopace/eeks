const LeafNode = require('../../lib/core/nodes/leaf-node.js').LeafNode;
const ListNode = require('../../lib/core/nodes/list-node.js').ListNode;
const ExactMatcher = require('../../lib/core/matchers/exact.js').ExactMatcher;
const AlwaysMatcher = require('../../lib/core/matchers/always.js').AlwaysMatcher;

const FakeChooser = require('../doubles/fake-chooser.js').FakeChooser;
const SpyCommand = require('../doubles/spy-command.js').SpyCommand;

test('Can navigate a simple menu', () => {
    const rootNode = new ListNode(
        null,

    );

    expect(rootNode).toBeInstanceOf(ListNode);
    expect(rootNode.children).toHaveLength(3);
    rootNode.children.forEach((child) => {
        expect(child).toBeInstanceOf(LeafNode);
        expect(child.parentNode).toBe(rootNode);
    })
});