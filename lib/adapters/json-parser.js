const ListNode = require('../core/node/list-node.js').ListNode;
const LeafNode = require('../core/node/leaf-node.js').LeafNode;

const toTree = jsonConfig => {
    const config = JSON.parse(jsonConfig);
    console.log(config);
    return new ListNode();
}

module.exports = {
    toTree
}