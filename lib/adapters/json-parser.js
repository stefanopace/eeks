const ListNode = require('../core/nodes/list-node.js').ListNode;
const { DynamicNode } = require('../core/nodes/dynamic-node.js');
const LeafNode = require('../core/nodes/leaf-node.js').LeafNode;

const ExactMatcher = require('../core/matchers/exact.js').ExactMatcher;
const AlwaysMatcher = require('../core/matchers/always.js').AlwaysMatcher;

class ConfigParser {
    constructor(commandRunner, chooser){
        this.commandRunner = commandRunner;
        this.chooser = chooser;
    }

    parseConfigFile(jsonConfig) {
        const config = JSON.parse(jsonConfig);
        return this.parseConfig(config, null);
    }

    parseLeafConfig(nodeConfig, parentNode, matcher) {
        return new LeafNode(
            this.commandRunner,
            parentNode,
            matcher,
            nodeConfig.execute.commands,
        );
    }

    parseListConfig(nodeConfig, parentNode, matcher) {
        const listNode = new ListNode(
            this.commandRunner,
            this.chooser,
            nodeConfig.returns,
            parentNode,
            undefined,
            matcher,
            nodeConfig.options
        );

        const children = nodeConfig.resolvers.map(((resolver) => {
            return this.parseConfig(resolver, listNode)
        }).bind(this) );

        listNode.children = children;
        return listNode;
    }

    parseDynamicConfig(nodeConfig, parentNode, matcher) {
        const dynamicNode = new DynamicNode(
            this.commandRunner,
            this.chooser,
            nodeConfig.returns,
            parentNode,
            undefined,
            matcher,
            nodeConfig.execute.commands
        )

        const children = nodeConfig.resolvers.map(((resolver) => {
            return this.parseConfig(resolver, dynamicNode)
        }).bind(this) );

        dynamicNode.children = children;
        return dynamicNode;
    }
    
    parseConfig(nodeConfig, parentNode) {
        const matcher = this.parseMatcherConfig(nodeConfig);

        switch (nodeConfig.type) {
            case "leaf":
                return this.parseLeafConfig(nodeConfig, parentNode, matcher);
            case "list":
                return this.parseListConfig(nodeConfig, parentNode, matcher);
            case "dynamic":
                return this.parseDynamicConfig(nodeConfig, parentNode, matcher);
        }
    }

    parseMatcherConfig(nodeConfig){
        if (Array.isArray(nodeConfig.match)){ 
            return new ExactMatcher(nodeConfig.match)
        }

        return new AlwaysMatcher();
    }
}

module.exports = {
    ConfigParser
}