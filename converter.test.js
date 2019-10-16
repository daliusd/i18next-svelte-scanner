const { convertToObject } = require('./converter');

describe('convertToObject', () => {
    it('empty list', () => {
        const [obj, err] = convertToObject([]);
        expect(JSON.stringify(obj)).toEqual('{}');
        expect(err.length).toEqual(0);
    });

    it('flat case', () => {
        const [obj, err] = convertToObject([{ key: 'key' }]);
        expect(JSON.stringify(obj)).toEqual('{"key":""}');
        expect(err.length).toEqual(0);
    });

    it('flat case with default value', () => {
        const [obj, err] = convertToObject([{ key: 'key', defaultValue: 'test' }]);
        expect(JSON.stringify(obj)).toEqual('{"key":"test"}');
        expect(err.length).toEqual(0);
    });

    it('flat case with same key and same default values', () => {
        const [obj, err] = convertToObject([{ key: 'key', defaultValue: 'test' }, { key: 'key', defaultValue: 'test' }]);
        expect(JSON.stringify(obj)).toEqual('{"key":"test"}');
        expect(err.length).toEqual(0);
    });

    it('flat case with same key but different default values', () => {
        const [obj, err] = convertToObject([{ key: 'key', defaultValue: 'test' }, { key: 'key', defaultValue: 'test2' }]);
        expect(JSON.stringify(obj)).toEqual('{"key":"test"}');
        expect(err.length).toEqual(1);
    });

    it('flat case with pluralization', () => {
        const [obj, err] = convertToObject([{ key: 'key', pluralize: true }]);
        expect(JSON.stringify(obj)).toEqual('{"key":"","key_plural":""}');
        expect(err.length).toEqual(0);
    });

    it('nested case', () => {
        const [obj, err] = convertToObject([{ key: 'key.subkey' }, { key: 'key.subkey2' }]);
        expect(JSON.stringify(obj)).toEqual('{"key":{"subkey":"","subkey2":""}}');
        expect(err.length).toEqual(0);
    });

    it('test if keys are sorted', () => {
        const [obj, err] = convertToObject([{ key: 'b' }, { key: 'a.c' }, { key: 'a.b' }]);
        expect(JSON.stringify(obj)).toEqual('{"a":{"b":"","c":""},"b":""}');
        expect(err.length).toEqual(0);
    });
});
