const ListNode = require('../core/node/list-node.js').ListNode;
const LeafNode = require('../core/node/leaf-node.js').LeafNode;

const ExactMatcher = require('../core/matchers/exact.js').ExactMatcher;
const NeverMatcher = require('../core/matchers/never.js').NeverMatcher;
const AlwaysMatcher = require('../core/matchers/always.js').AlwaysMatcher;

class ConfigParser {
    constructor(commandRunner, chooser){
        this.commandRunner = commandRunner;
        this.chooser = chooser;
    }

    parseConfigFile(jsonConfig) {
        const config = JSON.parse(jsonConfig);
        console.log(config);
        return this.parseConfig(config, null);
    }

    parseLeafConfig(nodeConfig, parentNode, matcher) {
        return new LeafNode(
            this.commandRunner,
            this.chooser,
            undefined,
            undefined,
            undefined
        );
    }

    parseListConfig(nodeConfig, parentNode, matcher) {
        const listNode = new ListNode(
            this.commandRunner,
            this.chooser,
            parentNode,
            undefined,
            nodeConfig.options
        );

        const children = nodeConfig.resolvers.map(((resolver) => {
            return this.parseConfig(resolver, listNode)
        }).bind(this) );

        listNode.children = children;

        return listNode;
    }
    
    parseConfig(nodeConfig, parentNode) {
        const matcher = this.parseMatcherConfig(nodeConfig);

        switch (nodeConfig.type) {
            case "leaf":
                return this.parseLeafConfig(nodeConfig, parentNode, matcher);
            case "list":
                return this.parseListConfig(nodeConfig, parentNode, matcher);
        }
    }

    parseMatcherConfig(nodeConfig){
        if (Array.isArray(nodeConfig.match)){ 
            return new ExactMatcher(nodeConfig.match)
        }

        return new NeverMatcher();
    }
}

module.exports = {
    ConfigParser
}