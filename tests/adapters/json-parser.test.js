const LeafNode = require('../../lib/core/nodes/leaf-node.js').LeafNode;
const ListNode = require('../../lib/core/nodes/list-node.js').ListNode;
const ConfigParser = require('../../lib/adapters/json-parser.js').ConfigParser;

const json1 = `
{
    "type": "list",
    "returns": "name",
    "options": ["World", "Man", "Unknown", "Johnny"],
    "resolvers": [ {
            "type": "leaf",
            "match" : ["World"],
            "execute": {
                "lang": "sh",
                "commands": ["echo Hello World!"]
            }
        },{
            "type": "leaf",
            "match" : ["Man"],
            "execute": {
                "lang": "sh",
                "commands": ["echo Yo man!"]
            }
        },{
            "type": "leaf",
            "match": ["Unknow", "Johnny"],
            "execute": {
                "lang": "sh",
                "commands": ["echo \\"Who are you {name}?\\""]
            }
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
            "match": ["1", "2"],
            "options": ["a", "b", "c"],
            "resolvers": [ {
                "type": "leaf",
                "match": ["a", "c"],
                "execute": {
                    "lang": "sh",
                    "commands": ["ls"]
                }
            } ]
        },{
            "type": "leaf",
            "match" : ["Man"],
            "execute": {
                "lang": "sh",
                "commands": ["echo Yo man!"]
            }
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