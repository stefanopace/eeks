const { ListNode } = require('./nodes/list-node');
const { DynamicNode } = require('./nodes/dynamic-node');
const { RecursiveNode } = require('./nodes/recursive-node');
const { LeafNode } = require('./nodes/leaf-node');

const { ExactMatcher } = require('./matchers/exact');
const { AlwaysMatcher } = require('./matchers/always');
const { ContainsMatcher }= require('./matchers/contains');
const { RegexMatcher }= require('./matchers/regex');
const { RegexFilter } = require('./filters/regex');

class ConfigParser {
	constructor(commandRunner, chooser){
		this.commandRunner = commandRunner;
		this.chooser = chooser;
	}

	parseLeafConfig(nodeConfig, parentNode, matcher) {
		return new LeafNode(
			this.commandRunner,
			parentNode,
			matcher,
			nodeConfig.execute,
		);
	}

	parseListConfig(nodeConfig, parentNode, matcher, filters) {
		const listNode = new ListNode(
			this.commandRunner,
			this.chooser,
			nodeConfig.returns,
			parentNode,
			undefined,
			matcher,
			nodeConfig.options,
			filters
		);

		const children = nodeConfig.resolvers.map(((resolver) => {
			return this.parseConfig(resolver, listNode)
		}).bind(this) );

		listNode.children = children;
		return listNode;
	}

	parseDynamicConfig(nodeConfig, parentNode, matcher, filters) {
		const dynamicNode = new DynamicNode(
			this.commandRunner,
			this.chooser,
			nodeConfig.returns,
			parentNode,
			undefined,
			matcher,
			nodeConfig.execute,
			filters
		)

		const children = nodeConfig.resolvers.map(((resolver) => {
			return this.parseConfig(resolver, dynamicNode)
		}).bind(this) );

		dynamicNode.children = children;
		return dynamicNode;
	}

	parseRecursiveConfig(nodeConfig, parentNode, matcher, filters) {
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
			nodeConfig["stop-condition"],
			filters
		);

		const children = nodeConfig.resolvers.map(((resolver) => {
			return this.parseConfig(resolver, recursiveNode)
		}).bind(this) );

		recursiveNode.children = children;

		return recursiveNode;
	}
	
	parseFilterConfig(nodeConfig){
		if (!nodeConfig['filters']){
			return null
		}
		
		return nodeConfig.filters.map((filterConfig) => {
			switch (filterConfig.type) {
				case "regex":
					return new RegexFilter(filterConfig.substitute, filterConfig.with);
				default:
					return null;
			}
		})
	}

	parseConfig(nodeConfig, parentNode) {
		const matcher = this.parseMatcherConfig(nodeConfig);
		const filters = this.parseFilterConfig(nodeConfig);

		switch (nodeConfig.type) {
			case "leaf":
				return this.parseLeafConfig(nodeConfig, parentNode, matcher, filters);
			case "list":
				return this.parseListConfig(nodeConfig, parentNode, matcher, filters);
			case "dynamic":
				return this.parseDynamicConfig(nodeConfig, parentNode, matcher, filters);
			case "recursive":
				return this.parseRecursiveConfig(nodeConfig, parentNode, matcher, filters);
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