const fs = require('fs');

const simpleListMenu = JSON.parse(fs.readFileSync('./tests/configurations/simple-list-menu.json', 'utf-8'));
const simpleMenuWithParams = JSON.parse(fs.readFileSync('./tests/configurations/simple-menu-with-params.json', 'utf-8'));
const simpleFsNavigation = JSON.parse(fs.readFileSync('./tests/configurations/simple-recursive-fs-navigation.json', 'utf-8'));
const simpleDynamicMenu = JSON.parse(fs.readFileSync('./tests/configurations/simple-dynamic-menu.json', 'utf-8'));
const recursiveMenuWithAllMatchers = JSON.parse(fs.readFileSync('./tests/configurations/recursive-with-all-matchers.json', 'utf-8'));
const simpleListWithOutputFilter = JSON.parse(fs.readFileSync('./tests/configurations/simple-list-with-output-filter.json', 'utf-8'));
const simpleRecursive = JSON.parse(fs.readFileSync('./tests/configurations/simple-recursive.json', 'utf-8'));

module.exports = {
	simpleListMenu,
	simpleMenuWithParams,
	simpleFsNavigation,
	simpleRecursive,
	simpleDynamicMenu,
	recursiveMenuWithAllMatchers,
	simpleListWithOutputFilter
}
