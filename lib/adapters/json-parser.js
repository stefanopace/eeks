const ListNode = require('../core/nodes/list-node.js').ListNode;
const { DynamicNode } = require('../core/nodes/dynamic-node.js');
const { RecursiveNode } = require('../core/nodes/recursive-node.js');
const LeafNode = require('../core/nodes/leaf-node.js').LeafNode;

const ExactMatcher = require('../core/matchers/exact.js').ExactMatcher;
const AlwaysMatcher = require('../core/matchers/always.js').AlwaysMatcher;
const { ContainsMatcher }= require('../core/matchers/contains.js');
const { RegexMatcher }= require('../core/matchers/regex.js');

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
            nodeConfig.execute,
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
            nodeConfig.execute
        )

        const children = nodeConfig.resolvers.map(((resolver) => {
            return this.parseConfig(resolver, dynamicNode)
        }).bind(this) );

        dynamicNode.children = children;
        return dynamicNode;
    }

    parseRecursiveConfig(nodeConfig, parentNode, matcher) {
        const recursiveNode = new RecursiveNode(
            this.commandRunner,
            this.chooser,
            nodeConfig.returns,
            parentNode,
            undefined,
            matcher,
            nodeConfig.execute,
            nodeConfig.accumulator,
            nodeConfig.initial,
            nodeConfig["stop-condition"]
        );

        const children = nodeConfig.resolvers.map(((resolver) => {
            return this.parseConfig(resolver, recursiveNode)
        }).bind(this) );

        recursiveNode.children = children;

        return recursiveNode;
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
            case "recursive":
                return this.parseRecursiveConfig(nodeConfig, parentNode, matcher);
        }
    }

    parseExactMatcher(nodeConfig){
        if (nodeConfig === undefined) 
            return null;
        return new ExactMatcher(nodeConfig)
    }

    parseContainsMatcher(nodeConfig){
        if (nodeConfig === undefined) 
            return null;
        return new ContainsMatcher(nodeConfig)
    }

    parseRegexMatcher(nodeConfig){
        if (nodeConfig === undefined) 
            return null;
        return new RegexMatcher(nodeConfig)
    }

    parseMatcherConfig(nodeConfig){
        const matchers = [
            this.parseExactMatcher(nodeConfig["match-exact"]),
            this.parseContainsMatcher(nodeConfig["match-contains"]),
            this.parseRegexMatcher(nodeConfig["match-regex"])
        ].filter((matcher) => matcher != null);
        
        if (matchers.length === 0){
            return [new AlwaysMatcher()];
        }

        return matchers;
    }
}

module.exports = {
    ConfigParser
}