const json = `
{
    "name": "Greetings",
    "description": "
    "options": [
        {
            "name": "Hello",
            "returns": "name",
            "description": "say hi!",
            "options": [
                {
                    "name": "World",
                    "execute": {
                        "lang": "sh",
                        "commands": ["echo Hello World!"]
                    }
                },
                {
                    "name": "Man",
                    "execute": {
                        "lang": "sh",
                        "commands": ["echo Yo man!"]
                    }
                },
                {
                    "name": "Unknow"
                },
                {
                    "name": "Johnny"
                }
            ]
            "execute": {
                "lang": "sh"
                "commands": ["echo \"Who are you, $name?\""]
            }
        }
    ]
}
`;

const LeafNode = require('../../lib/core/node/leaf-node.js').LeafNode;
const ListNode = require('../../lib/core/node/list-node.js').ListNode;
const parser = require('../../lib/adapters/json-parser.js');

test('Can parse a json with only list nodes and leafs', () => {
    const rootNode = parser.toTree(json);
    expect(rootNode).toBeInstanceOf(ListNode);
    rootNode.children.forEach((child) => {
        expect(child).toBeInstanceOf(ListNode);
        child.children.forEach((nepote) => {
            expect(nepote).toBeInstanceOf(LeafNode);
        })
    })
});