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
	expect(doc.isActive).toBe(false);
	const col = new Collection(() => `${doc.path}/albums`);
	expect(doc.isActive).toBe(false);
	expect(col.path).toBe('artists/FooFighters/albums');
	doc.path = 'artists/TheOffspring';
	const dispose = autorun(() => {
		col.docs.length;
	});
	expect(col.path).toBe('artists/TheOffspring/albums');
	dispose();
});

test('document data', async () => {
	expect.assertions(9);
	const doc = new Document('settings/setting');
	expect(doc.isActive).toBe(false);
	const col = new Collection(() => `artists/${doc.data.topArtistId}/albums`);
	expect(doc.isActive).toBe(false);
	expect(col.isActive).toBe(false);
	const dispose = autorun(() => {
		col.docs.length;
	});
	expect(doc.isActive).toBe(true);
	expect(col.isActive).toBe(true);
	await col.ready();
	expect(col.path).toBe('artists/FooFighters/albums');
	dispose();
	expect(col.isActive).toBe(false);
	expect(doc.isActive).toBe(false);
	col.path = undefined;
	expect(doc.isActive).toBe(false);
});
