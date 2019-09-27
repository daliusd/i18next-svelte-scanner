i18next Scanner for Svelte
==========================

This is i18next scanner for Svelte.

Installation
------------

`npm i -D i18next-svelte-scanner`

Usage
-----

Sample usage might look like this:

`npx i18next-svelte-scanner -s src -o l10n.json`

Expected l10n format
--------------------

Current implementation assumes that l10n is done via function named `_` (but most
probably you will use it in `$_` more frequently.

Here are some example how l10n might look like in Svelte:

```javascript

// placeholder for translatable string identified by key only
$_('key')

// placeholder for translatable string identified by key and having default value
$_('key', 'default value')

// placeholder for translatable string identified by key that is pluralized
$_('pages', { count: pages })

// placeholder for translatable string that has defaultValue and expects more parameters
$_('error', {
    defaultValue: 'Error in file "{{name}}"',
    name: filename,
})
```

Sample i18next usage in Svelte
------------------------------

Here is sample how to create `_` in i18next using Svelte.

```javascript
import { writable } from 'svelte/store';
import i18next from 'i18next';

function createL10nStore() {
    const { subscribe, update } = writable(i18next.t);

    async function init() {
        let resources = {}; // TODO: get resources here. Can be read from file, downloaded from service and etc.

        let t = await i18next.init({
            lng: 'en',
            resources,
        });
        update(_t => t);
    }

    async function changeLanguage(lang) {
        let t = await i18next.changeLanguage(lang);
        update(_t => t);
    }

    return {
        subscribe,
        init,
        changeLanguage,
    };
}

export const _ = createL10nStore();
```
