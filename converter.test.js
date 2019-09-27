const { convertToObject } = require('./converter');

describe('convertToObject', () => {
    it('empty list', () => {
        const obj = convertToObject([]);
        expect(JSON.stringify(obj)).toEqual('{}');
    });

    it('flat case', () => {
        const obj = convertToObject([{ key: 'key' }]);
        expect(JSON.stringify(obj)).toEqual('{"key":""}');
    });

    it('flat case with default value', () => {
        const obj = convertToObject([{ key: 'key', defaultValue: 'test' }]);
        expect(JSON.stringify(obj)).toEqual('{"key":"test"}');
    });

    it('flat case with pluralization', () => {
        const obj = convertToObject([{ key: 'key', pluralize: true }]);
        expect(JSON.stringify(obj)).toEqual('{"key":"","key_plural":""}');
    });

    it('nested case', () => {
        const obj = convertToObject([{ key: 'key.subkey' }, { key: 'key.subkey2' }]);
        expect(JSON.stringify(obj)).toEqual('{"key":{"subkey":"","subkey2":""}}');
    });

    it('test if keys are sorted', () => {
        const obj = convertToObject([{ key: 'b' }, { key: 'a.c' }, { key: 'a.b' }]);
        expect(JSON.stringify(obj)).toEqual('{"a":{"b":"","c":""},"b":""}');
    });
});
