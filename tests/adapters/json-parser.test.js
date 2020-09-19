const json = `
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

const LeafNode = require('../../lib/core/node/leaf-node.js').LeafNode;
const ListNode = require('../../lib/core/node/list-node.js').ListNode;
const ConfigParser = require('../../lib/adapters/json-parser.js').ConfigParser;

test('Can parse a json with only one list node and 3 leaves', () => {
    const parser = new ConfigParser(json, null, null);
    const rootNode = parser.parseConfigFile(json);
    expect(rootNode).toBeInstanceOf(ListNode);
    expect(rootNode.children).toHaveLength(3);
    rootNode.children.forEach((child) => {
        expect(child).toBeInstanceOf(LeafNode);
    })
});