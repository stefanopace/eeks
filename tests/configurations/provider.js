const fs = require('fs');

const simpleListMenu = JSON.parse(fs.readFileSync('./tests/configurations/simple-list-menu.json', 'utf-8'));
const simpleMenuWithParams = JSON.parse(fs.readFileSync('./tests/configurations/simple-menu-with-params.json', 'utf-8'));
const simpleRecursiveMenu = JSON.parse(fs.readFileSync('./tests/configurations/simple-recursive-menu.json', 'utf-8'));
const simpleDynamicMenu = JSON.parse(fs.readFileSync('./tests/configurations/simple-dynamic-menu.json', 'utf-8'));

module.exports = {
    simpleListMenu,
    simpleMenuWithParams,
    simpleRecursiveMenu,
    simpleDynamicMenu
}
