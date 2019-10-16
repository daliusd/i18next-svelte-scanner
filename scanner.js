#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const program = require('commander');
const version = require('./package.json').version;
const { collectStrings } = require('./collector');
const { convertToObject } = require('./converter');

program.version(version);
program.option('-s, --source-dir <dir>', 'source directory').option('-o, --output-file <path>', 'output json');
program.parse(process.argv);

let collectedStrings = [];

function walkTree(dir) {
    for (const dirEnt of fs.readdirSync(dir, { withFileTypes: true })) {
        if (dirEnt.isDirectory()) {
            walkTree(path.join(dir, dirEnt.name));
        } else if (path.parse(dirEnt.name).ext === '.svelte') {
            let fileName = path.join(dir, dirEnt.name);
            let sourceCode = fs.readFileSync(fileName, 'utf8');

            collectedStrings = collectedStrings.concat(collectStrings(sourceCode));
        }
    }
}

if (!program.sourceDir || !program.outputFile) {
    program.outputHelp();
} else {
    walkTree(program.sourceDir);
    let [object, err] = convertToObject(collectedStrings);
    fs.writeFileSync(program.outputFile, JSON.stringify(object, null, 4));

    if (err.length) {
        console.error(err.join('\n'));
    }
}
