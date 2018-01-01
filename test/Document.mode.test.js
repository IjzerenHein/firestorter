import { Document } from './init';

describe('construct', () => {
	test('default is auto', () => {
		const doc = new Document();
		expect(doc.mode).toBe('auto');
		expect(doc.active).toBe(false);
	});

	test('auto', () => {
		const doc = new Document(undefined, { mode: 'auto' });
		expect(doc.mode).toBe('auto');
		expect(doc.active).toBe(false);
	});

	test('on', () => {
		const doc = new Document(undefined, { mode: 'on' });
		expect(doc.mode).toBe('on');
		expect(doc.active).toBe(false);
	});

	test('off', () => {
		const doc = new Document(undefined, { mode: 'off' });
		expect(doc.mode).toBe('off');
		expect(doc.active).toBe(false);
	});

	test('bogus', () => {
		expect(() => new Document(undefined, { mode: 'bogus' })).toThrow();
	});
});

describe('get/set', () => {
	test('on', () => {
		const doc = new Document();
		doc.mode = 'on';
		expect(doc.mode).toBe('on');
		expect(doc.active).toBe(false);
	});
	test('off', () => {
		const doc = new Document();
		doc.mode = 'off';
		expect(doc.mode).toBe('off');
		expect(doc.active).toBe(false);
	});
	test('auto', () => {
		const doc = new Document(undefined, { mode: 'off' });
		doc.mode = 'auto';
		expect(doc.mode).toBe('auto');
		expect(doc.active).toBe(false);
	});
	test('bogus', () => {
		const doc = new Document();
		expect(() => (doc.mode = 'bogus')).toThrow();
	});
	test('empty string', () => {
		const doc = new Document();
		expect(() => (doc.mode = '')).toThrow();
	});
	test('undefined', () => {
		const doc = new Document();
		expect(() => (doc.mode = undefined)).toThrow();
	});
});
