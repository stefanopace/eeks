const ListNode = require('../core/node/list-node.js').ListNode;
const LeafNode = require('../core/node/leaf-node.js').LeafNode;

class ConfigParser {
    constructor(commandRunner, chooser){
        this.commandRunner = commandRunner;
        this.chooser = chooser;
    }

    parseConfigFile(jsonConfig) {
        const config = JSON.parse(jsonConfig);
        console.log(config);
        return this.parseNode(config);
    }

    parseLeafNode(node) {
        return new LeafNode(
            this.commandRunner,
            this.chooser,
            undefined,
            undefined,
            undefined
        );
    }

    parseListNode(node) {
        return new ListNode(
            this.commandRunner,
            this.chooser,
            undefined,
            [],
            node.options
        );
    }
    
    parseNode (node) {
        switch (node.type) {
            case "leaf":
                return this.parseLeafNode(node);
            case "list":
                return this.parseListNode(node);
        }
    }
}



module.exports = {
    ConfigParser
}