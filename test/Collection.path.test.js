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
