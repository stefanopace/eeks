const { ListNode } = require('./nodes/list-node');
const { DynamicNode } = require('./nodes/dynamic-node');
const { RecursiveNode } = require('./nodes/recursive-node');
const { LeafNode } = require('./nodes/leaf-node');

const { ExactMatcher } = require('./matchers/exact');
const { AlwaysMatcher } = require('./matchers/always');
const { ContainsMatcher }= require('./matchers/contains');
const { RegexMatcher }= require('./matchers/regex');
const { RegexFilter } = require('./filters/regex');
const { Setter } = require('./setters/setter');

class ConfigParser {
	constructor(commandRunner, chooser, debug){
		this.commandRunner = commandRunner;
		this.chooser = chooser;
		this.debug = debug;
	}

	parseLeafConfig(nodeConfig, parentNode, matcher) {
		return new LeafNode(
			this.commandRunner,
			parentNode,
			matcher,
			nodeConfig.execute,
		);
	}

	parseListConfig(nodeConfig, parentNode, matcher, setters) {
		const listNode = new ListNode(
			this.commandRunner,
			this.chooser,
			setters,
			parentNode,
			undefined,
			matcher,
			nodeConfig.options,
		);

		const children = nodeConfig.resolvers.map(((resolver) => {
			return this.parseConfig(resolver, listNode)
		}).bind(this) );

		listNode.children = children;
		return listNode;
	}

	parseDynamicConfig(nodeConfig, parentNode, matcher, setters) {
		const dynamicNode = new DynamicNode(
			this.commandRunner,
			this.chooser,
			setters,
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

	parseRecursiveConfig(nodeConfig, parentNode, matcher, setters) {
		const recursiveNode = new RecursiveNode(
			this.commandRunner,
			this.chooser,
			setters,
			parentNode,
			undefined,
			matcher,
			nodeConfig.execute,
			nodeConfig.accumulator,
			nodeConfig.initial,
			nodeConfig["stop-condition"],
		);

		const children = nodeConfig.resolvers.map(((resolver) => {
			return this.parseConfig(resolver, recursiveNode)
		}).bind(this) );

		recursiveNode.children = children;

		return recursiveNode;
	}
	
	parseFilterConfig(nodeConfig){
		if (!nodeConfig['filters']){
			return []
		}
		
		return nodeConfig.filters.map((filterConfig) => {
			switch (filterConfig.type) {
				case "regex":
					return new RegexFilter(filterConfig.substitute, filterConfig.with, this.debug);
				default:
					return null;
			}
		})
	}

	parseConfig(nodeConfig, parentNode) {
		const matcher = this.parseMatcherConfig(nodeConfig);
		const setters = this.parseSettersConfig(nodeConfig);

		switch (nodeConfig.type) {
			case "leaf":
				return this.parseLeafConfig(nodeConfig, parentNode, matcher, setters);
			case "list":
				return this.parseListConfig(nodeConfig, parentNode, matcher, setters);
			case "dynamic":
				return this.parseDynamicConfig(nodeConfig, parentNode, matcher, setters);
			case "recursive":
				return this.parseRecursiveConfig(nodeConfig, parentNode, matcher, setters);
		}
	}

	parseSettersConfig(nodeConfig) {
		if (!nodeConfig.set){
			return []
		}
		
		return nodeConfig.set.map((setterConfig) => {
			const filters = this.parseFilterConfig(setterConfig);
			return new Setter(setterConfig.name, filters);
		})
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
