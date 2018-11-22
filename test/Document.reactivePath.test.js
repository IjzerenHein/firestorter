import { Document, Collection, observable } from './init';
import { runInAction } from 'mobx';

test('no path', () => {
	const doc = new Document(() => undefined);
	expect(doc.path).toBeUndefined();
});

test('valid path', () => {
	const doc = new Document(() => 'todos/todo');
	expect(doc.path).toBe('todos/todo');
});

test('invalid collection path', () => {
	expect(() => new Document(() => 'todos')).toThrow();
});

test('observable', () => {
	const name = observable.box('todo');
	const doc = new Document(() => 'todos/' + name.get());
	expect(doc.path).toBe('todos/todo');
	runInAction(() => name.set('todo2'));
	expect(doc.path).toBe('todos/todo2');
});

test('collection path', () => {
	const col = new Collection('todos');
	expect(col.isActive).toBe(false);
	const doc = new Document(() => `${col.path}/todo`);
	expect(col.isActive).toBe(false);
	expect(doc.path).toBe('todos/todo');
	col.path = 'todos2';
	expect(doc.path).toBe('todos2/todo');
});

test('document path', () => {
	const doc = new Document('artists/FooFighters');
	const subDoc = new Document(() => `${doc.path}/albums/test`);
	expect(doc.isActive).toBe(false);
	expect(subDoc.isActive).toBe(false);
	expect(subDoc.path).toBe('artists/FooFighters/albums/test');
	doc.path = 'artists/Metallica';
	expect(subDoc.path).toBe('artists/Metallica/albums/test');
});

test('document data', async () => {
	expect.assertions(3);
	const doc = new Document('artists/FooFighters', { mode: 'off' });
	const subDoc = new Document(
		() => `${doc.path}/albums/${doc.data.topAlbumId}`
	);
	expect(doc.isActive).toBe(false);
	expect(subDoc.isActive).toBe(false);
	await doc.fetch();
	expect(subDoc.path).toBe('artists/FooFighters/albums/TheColourAndTheShape');
});

test('document data 2', async () => {
	expect.assertions(3);
	const doc = new Document('artists/FooFighters');
	const subDoc = new Document(
		() => `${doc.path}/albums/${doc.data.topAlbumId}`
	);
	expect(doc.isActive).toBe(true);
	expect(subDoc.isActive).toBe(false);
	await doc.ready();
	expect(subDoc.path).toBe('artists/FooFighters/albums/TheColourAndTheShape');
});
