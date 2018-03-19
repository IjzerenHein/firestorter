import { Document, Collection, observable, autorun } from './init';

test('no path', () => {
	const col = new Collection(() => undefined);
	expect(col.path).toBeUndefined();
});

test('valid path', () => {
	const col = new Collection(() => 'todos');
	expect(col.path).toBe('todos');
});

test('invalid document path', () => {
	expect(() => new Collection(() => 'todos/todo')).toThrow();
});

test('observable', () => {
	const name = observable.box('FooFighters');
	const col = new Collection(() => 'artists/' + name.get() + '/albums');
	expect(col.path).toBe('artists/FooFighters/albums');
	name.set('TheOffspring');
	expect(col.path).toBe('artists/TheOffspring/albums');
});

test('document path', () => {
	const doc = new Document('artists/FooFighters');
	expect(doc.active).toBe(false);
	const col = new Collection(() => `${doc.path}/albums`);
	expect(doc.active).toBe(false);
	expect(col.path).toBe('artists/FooFighters/albums');
	doc.path = 'artists/TheOffspring';
	expect(col.path).toBe('artists/TheOffspring/albums');
});

test('document data', async () => {
	expect.assertions(7);
	const doc = new Document('settings/setting');
	expect(doc.active).toBe(false);
	const col = new Collection(() => `artists/${doc.data.topArtistId}/albums`);
	expect(doc.active).toBe(true);
	expect(col.active).toBe(false);
	const dispose = autorun(() => {
		col.docs.length;
	});
	expect(col.active).toBe(true);
	await col.ready();
	expect(col.path).toBe('artists/FooFighters/albums');
	dispose();
	expect(col.active).toBe(false);
	col.path = undefined;
	expect(doc.active).toBe(false);
});
