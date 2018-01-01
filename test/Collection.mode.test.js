import { Collection } from './init';

describe('construct', () => {
	test('default is auto', () => {
		const col = new Collection();
		expect(col.mode).toBe('auto');
		expect(col.active).toBe(false);
	});

	test('auto', () => {
		const col = new Collection(undefined, { mode: 'auto' });
		expect(col.mode).toBe('auto');
		expect(col.active).toBe(false);
	});

	test('on', () => {
		const col = new Collection(undefined, { mode: 'on' });
		expect(col.mode).toBe('on');
		expect(col.active).toBe(false);
	});

	test('off', () => {
		const col = new Collection(undefined, { mode: 'off' });
		expect(col.mode).toBe('off');
		expect(col.active).toBe(false);
	});

	test('bogus', () => {
		expect(() => new Collection(undefined, { mode: 'bogus' })).toThrow();
	});
});

describe('get/set', () => {
	test('on', () => {
		const col = new Collection();
		col.mode = 'on';
		expect(col.mode).toBe('on');
		expect(col.active).toBe(false);
	});
	test('off', () => {
		const col = new Collection();
		col.mode = 'off';
		expect(col.mode).toBe('off');
		expect(col.active).toBe(false);
	});
	test('auto', () => {
		const col = new Collection(undefined, { mode: 'off' });
		col.mode = 'auto';
		expect(col.mode).toBe('auto');
		expect(col.active).toBe(false);
	});
	test('bogus', () => {
		const col = new Collection();
		expect(() => (col.mode = 'bogus')).toThrow();
	});
	test('empty string', () => {
		const col = new Collection();
		expect(() => (col.mode = '')).toThrow();
	});
	test('undefined', () => {
		const col = new Collection();
		expect(() => (col.mode = undefined)).toThrow();
	});
});
