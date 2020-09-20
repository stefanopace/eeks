const { LeafNode } = require('../../lib/core/nodes/leaf-node.js');
const { ListNode } = require('../../lib/core/nodes/list-node.js');
const { DynamicNode } = require('../../lib/core/nodes/dynamic-node.js');
const { RecursiveNode } = require('../../lib/core/nodes/recursive-node.js');
const { ConfigParser } = require('../../lib/adapters/json-parser.js');
const { AlwaysMatcher } = require('../../lib/core/matchers/always.js');
const { ExactMatcher } = require('../../lib/core/matchers/exact.js');
const { ContainsMatcher } = require('../../lib/core/matchers/contains.js');
const { RegexMatcher } = require('../../lib/core/matchers/regex.js');

const json1 = `
{
    "type": "list",
    "returns": "name",
    "options": ["World", "Man", "Unknown", "Johnny"],
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
            "match-exact": ["Unknow", "Johnny"],
            "execute": ["echo \\"Who are you {name}?\\""]
    } ]
}
`;

test('Can parse a json with only one list node and 3 leaves', () => {
    const parser = new ConfigParser(null, null);
    const rootNode = parser.parseConfigFile(json1);

    expect(rootNode).toBeInstanceOf(ListNode);
    expect(rootNode.children).toHaveLength(3);
    rootNode.children.forEach((child) => {
        expect(child).toBeInstanceOf(LeafNode);
        expect(child.parentNode).toBe(rootNode);
    })
});

const json2 = `
{
    "type": "list",
    "returns": "name",
    "options": ["1", "2", "3", "4"],
    "resolvers": [ {
            "type": "list",
            "returns": "num",
            "match-exact": ["1", "2"],
            "options": ["a", "b", "c"],
            "resolvers": [ {
                "type": "leaf",
                "match-exact": ["a", "c"],
                "execute": ["ls"]
            } ]
        },{
            "type": "leaf",
            "match-exact" : ["Man"],
            "execute": ["echo Yo man!"]
    } ]
}
`;

test('Can parse nested list nodes', () => {
    const parser = new ConfigParser(null, null);
    const rootNode = parser.parseConfigFile(json2);

    expect(rootNode).toBeInstanceOf(ListNode);
    expect(rootNode.children).toHaveLength(2);
    expect(rootNode.children[0]).toBeInstanceOf(ListNode);
    expect(rootNode.children[1]).toBeInstanceOf(LeafNode);

    expect(rootNode.children[0].parentNode).toBe(rootNode);
    expect(rootNode.children[1].parentNode).toBe(rootNode);

    rootNode.children[0].children.forEach((child) => {
        expect(child).toBeInstanceOf(LeafNode);
        expect(child.parentNode).toBe(rootNode.children[0]);
    })
});

const json3 = `
{
    "type": "dynamic",
    "returns": "path",
    "execute": ["ls"],
    "resolvers": [ {
        "type": "leaf",
        "execute": ["echo {path}"]
    } ]
}
`;

test('Can parse dynamic list nodes', () => {
    const parser = new ConfigParser(null, null);
    const rootNode = parser.parseConfigFile(json3);

    expect(rootNode).toBeInstanceOf(DynamicNode);
    expect(rootNode.children).toHaveLength(1);
    expect(rootNode.children[0]).toBeInstanceOf(LeafNode);
    expect(rootNode.children[0].parentNode).toBe(rootNode);
});

const json4 = `
{
    "type": "recursive",
    "returns": "path",
    "accumulator": "acc",
    "initial": "",
    "execute": ["ls $(echo {acc} | tr \\" \\" \\"/\\")"],
    "stop-condition": ["test -f $(echo {pre} | tr \\" \\" \\"/\\")"],
    "resolvers": [ {
        "type": "leaf",
        "execute": ["xdg-open {path}"]
    } ]
}
`;

test('Can parse recursive list nodes', () => {
    const parser = new ConfigParser(null, null);
    const rootNode = parser.parseConfigFile(json4);

    expect(rootNode).toBeInstanceOf(RecursiveNode);
});


const json5 = `
{
    "type": "recursive",
    "returns": "path",
    "accumulator": "acc",
    "initial": "",
    "execute": ["ls $(echo {acc} | tr \\" \\" \\"/\\")"],
    "stop-condition": ["test -f $(echo {pre} | tr \\" \\" \\"/\\")"],
    "resolvers": [ 
        {
            "type": "leaf",
            "execute": ["xdg-open {path}"]
        },
        {
            "type": "leaf",
            "match-exact": ["package.json"],
            "execute": ["echo matched exactly package.json {path}"]
        },
        {
            "type": "leaf",
            "match-contains": ["node", "system"],
            "match-exact": ["never.js"],
            "execute": ["echo matched containing node {path}"]
        },
        {
            "type": "leaf",
            "match-regex": ["^.*\\\\.js$"],
            "execute": ["echo matched regex ends with .js {path}"]
        }
    ]
}
`
test('Can parse matchers', () => {
    const parser = new ConfigParser(null, null);
    const rootNode = parser.parseConfigFile(json5);

    expect(rootNode.children[0].matchers[0]).toBeInstanceOf(AlwaysMatcher);
    expect(rootNode.children[1].matchers[0]).toBeInstanceOf(ExactMatcher);
    expect(rootNode.children[2].matchers[0]).toBeInstanceOf(ExactMatcher);
    expect(rootNode.children[2].matchers[1]).toBeInstanceOf(ContainsMatcher);
    expect(rootNode.children[3].matchers[0]).toBeInstanceOf(RegexMatcher);
});