import { Document } from './init';

test('no ref fail', async () => {
	expect.assertions(1);
	const doc = new Document();
	try {
		await doc.fetch();
	} catch (e) {
		expect(e).toEqual(new Error('No ref or path set on Document'));
	}
});

test('fetch', async () => {
	expect.assertions(1);
	const doc = new Document('artists/FooFighters');
	await doc.fetch();
	expect(doc.data.topAlbumId).toBe('TheColourAndTheShape');
});

test('already in progress', async () => {
	expect.assertions(1);
	const doc = new Document('artists/FooFighters');
	doc.fetch();
	try {
		await doc.fetch();
	} catch (e) {
		expect(e).toEqual(new Error('Fetch already in progress'));
	}
});

test('ready', async () => {
	expect.assertions(3);
	const doc = new Document('artists/FooFighters');
	doc.fetch();
	expect(doc.fetching).toBe(true);
	await doc.ready();
	expect(doc.fetching).toBe(false);
	expect(doc.data.topAlbumId).toBe('TheColourAndTheShape');
});
