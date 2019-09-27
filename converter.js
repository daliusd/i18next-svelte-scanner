function convertToObject(collectedStrings) {
    collectedStrings.sort((a, b) => a.key.localeCompare(b.key));
    let result = {};

    for (const locStr of collectedStrings) {
        let parent = result;
        let keys = locStr.key.split('.');
        let subKeys = keys.splice(0, keys.length - 1);
        let key = keys[keys.length - 1];

        for (const subKey of subKeys) {
            if (subKey in parent) {
                parent = result[subKey];
            } else {
                result[subKey] = {};
                parent = result[subKey];
            }
        }
        parent[key] = locStr.defaultValue || '';
        if (locStr.pluralize) {
            parent[`${key}_plural`] = '';
        }
    }

    return result;
}

module.exports = {
    convertToObject,
};
