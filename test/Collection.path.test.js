import { Collection } from './init';

test('no path', () => {
	const col = new Collection();
	expect(col.path).toBeUndefined();
	expect(col.ref).toBeUndefined();
});

test('get path', () => {
	const col = new Collection('todos');
	expect(col.path).toBe('todos');
	expect(col.ref).toBeDefined();
});

test('set path', () => {
	const col = new Collection();
	col.path = 'todos';
	expect(col.path).toBe('todos');
	expect(col.ref).toBeDefined();
});

test('clear path', () => {
	const col = new Collection('todos');
	col.path = undefined;
	expect(col.path).toBeUndefined();
	expect(col.ref).toBeUndefined();
});

test('replace ref', () => {
	const col = new Collection('todos');
	col.path = 'todos2';
	expect(col.path).toBe('todos2');
	expect(col.ref).toBeDefined();
});

test('change path to empty collection', async () => {
	expect.assertions(2);
	const col = new Collection('artists');
	await col.fetch();
	expect(col.docs.length).toBeGreaterThan(0);
	col.path = 'emptyCollection';
	await col.fetch();
	expect(col.docs.length).toBe(0);
});

test('change path to forbidden collection', async () => {
	expect.assertions(3);
	const col = new Collection('artists');
	await col.fetch();
	expect(col.docs.length).toBeGreaterThan(0);
	col.path = 'forbidden';
	try {
		await col.fetch();
	} catch (err) {
		expect(err).toBeDefined();
	}
	expect(col.docs.length).toBe(0);
});
