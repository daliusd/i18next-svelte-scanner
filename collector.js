const svelte = require('svelte/compiler');

function collectStrings(sourceCode) {
    const ast = svelte.parse(sourceCode);

    let collectedStrings = [];

    function verifyNode(node, name) {
        if (node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name === name) {
            if (node.arguments.length === 0 || node.arguments[0].type !== 'Literal') return;

            let result = { key: node.arguments[0].value, pluralize: false };

            if (node.arguments[1].type === 'Literal') {
                result.defaultValue = node.arguments[1].value;
            } else if (node.arguments[1].type === 'ObjectExpression') {
                let properties = node.arguments[1].properties;
                for (const prop of properties) {
                    if (prop.key.name === 'count') {
                        result.pluralize = true;
                    } else if (prop.key.name === 'defaultValue' && prop.value.type === 'Literal') {
                        result.defaultValue = prop.value.value;
                    }
                }
            }

            collectedStrings.push(result);
        }
    }

    svelte.walk(ast.instance, {
        enter(node) {
            verifyNode(node, '_');
        },
    });

    svelte.walk(ast.html, {
        enter(node) {
            verifyNode(node, '$_');
        },
    });

    return collectedStrings;
}

module.exports = {
    collectStrings,
};
