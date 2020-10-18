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
const { Accumulator } = require('./setters/accumulator');

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
			new Accumulator(
				nodeConfig.accumulator.name,
				this.parseFilterConfig(nodeConfig.accumulator),
				nodeConfig.accumulator.initial
			),
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

	parseMatcherConfig(nodeConfig){
		if (!nodeConfig.match){
			return [new AlwaysMatcher()];
		}

		return nodeConfig.match.map(matcherConfig => {
			switch (matcherConfig.type) {
				case "exact":
					return new ExactMatcher(matcherConfig.name, matcherConfig.value)
				case "contains":
					return new ContainsMatcher(matcherConfig.name, matcherConfig.value)
				case "regex":
					return new RegexMatcher(matcherConfig.name, matcherConfig.regex)
			}
		})
	}
}

module.exports = {
	ConfigParser
}
