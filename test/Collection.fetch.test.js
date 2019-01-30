import { Collection } from './init';

test('no ref fail', async () => {
	expect.assertions(1);
	const col = new Collection();
	try {
		await col.fetch();
	} catch (e) {
		expect(e).toEqual(new Error('No ref, path or query set on Collection'));
	}
});

test('fetch', async () => {
	expect.assertions(1);
	const col = new Collection('artists');
	await col.fetch();
	const docs = col.docs.filter(doc => doc.id !== 'TEMP');
	expect(docs.length).toBe(2);
});

test('already in progress', async () => {
	expect.assertions(1);
	const col = new Collection('artists');
	col.fetch();
	try {
		await col.fetch();
	} catch (e) {
		expect(e).toEqual(new Error('Fetch already in progress'));
	}
});

test('ready', async () => {
	expect.assertions(3);
	const col = new Collection('artists');
	col.fetch();
	expect(col.isLoading).toBe(true);
	await col.ready();
	expect(col.isLoading).toBe(false);
	const docs = col.docs.filter(doc => doc.id !== 'TEMP');
	expect(docs.length).toBe(2);
});
