const { collectStrings } = require('./collector');

describe('collectStrings', () => {
    it('finds simple key values', () => {
        let sourceCode = `
        <script>
            import { _ } from './l10n.js';
            $: a = _('key', 'value');
        </script>
        <style>

        </style>

        <span>{$_('key2', 'value2')}</span>
        `;

        const strings = collectStrings(sourceCode);
        expect(strings.length).toBe(2);
        expect(strings[0].key).toEqual('key');
        expect(strings[0].defaultValue).toEqual('value');
        expect(strings[0].pluralize).toBeFalsy();

        expect(strings[1].key).toEqual('key2');
        expect(strings[1].defaultValue).toEqual('value2');
        expect(strings[1].pluralize).toBeFalsy();
    });

    it('pluralization support', () => {
        let sourceCode = `
        <script>
            import { _ } from './l10n.js';
            export let x;

            $: a = _('key', { count: x });
        </script>
        <style>

        </style>

        <span>{$_('key2', { count: x})}</span>
        `;

        const strings = collectStrings(sourceCode);
        expect(strings.length).toBe(2);
        expect(strings[0].key).toEqual('key');
        expect(strings[0].defaultValue).toBeUndefined();
        expect(strings[0].pluralize).toBeTruthy();

        expect(strings[1].key).toEqual('key2');
        expect(strings[1].defaultValue).toBeUndefined();
        expect(strings[1].pluralize).toBeTruthy();
    });

    it('defaultValue support', () => {
        let sourceCode = `
        <script>
            import { _ } from './l10n.js';
            export let x;

            $: a = _('key', { defaultValue: 'value' });
        </script>
        <style>

        </style>

        <span>{$_('key2', { defaultValue: 'value2', count: x})}</span>
        `;

        const strings = collectStrings(sourceCode);
        expect(strings.length).toBe(2);
        expect(strings[0].key).toEqual('key');
        expect(strings[0].defaultValue).toEqual('value');
        expect(strings[0].pluralize).toBeFalsy();

        expect(strings[1].key).toEqual('key2');
        expect(strings[1].defaultValue).toEqual('value2');
        expect(strings[1].pluralize).toBeTruthy();
    });

    it('_ without params', () => {
        let sourceCode = `
        <script>
            import { _ } from './l10n.js';
        </script>
        <style>

        </style>

        <span>{$_()}</span>
        `;

        const strings = collectStrings(sourceCode);
        expect(strings.length).toBe(0);
    });

    it('_ with second param non literal', () => {
        let sourceCode = `
        <script>
            import { _ } from './l10n.js';
        </script>
        <style>

        </style>

        <span>{$_('key', () => ({defaultValue: 'x'}))}</span>
        `;

        const strings = collectStrings(sourceCode);
        expect(strings.length).toBe(1);
        expect(strings[0].key).toEqual('key');
        expect(strings[0].defaultValue).toBeUndefined();
        expect(strings[0].pluralize).toBeFalsy();
    });

    it('defaultValue non literal', () => {
        let sourceCode = `
        <script>
            import { _ } from './l10n.js';
        </script>
        <style>

        </style>

        <span>{$_('key', { defaultValue: () => ('test') })}</span>
        `;

        const strings = collectStrings(sourceCode);
        expect(strings.length).toBe(1);
        expect(strings[0].key).toEqual('key');
        expect(strings[0].defaultValue).toBeUndefined();
        expect(strings[0].pluralize).toBeFalsy();
    });
});
