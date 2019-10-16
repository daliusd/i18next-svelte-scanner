function convertToObject(collectedStrings) {
    collectedStrings.sort((a, b) => a.key.localeCompare(b.key));
    let result = {};
    let err = [];

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
        let defaultValue = locStr.defaultValue || '';

        if (key in parent) {
            if (locStr.defaultValue && parent[key] !== defaultValue) {
                err.push(`"${key}" has different default values "${parent[key]}" and "${defaultValue}"`);
            }
        } else {
            parent[key] = defaultValue;
        }

        if (locStr.pluralize) {
            parent[`${key}_plural`] = '';
        }
    }

    return [result, err];
}

module.exports = {
    convertToObject,
};
