import { Collection, firebase, observable } from './init';

test('no query', () => {
	const col = new Collection();
	expect(col.query).toBeUndefined();
});

test('constructor', () => {
	const ref = firebase.firestore().collection('artists');
	const query = ref.where('genre', '==', 'punk');
	const col = new Collection(ref, {
		query: query
	});
	expect(col.query).toBe(query);
});

test('update', () => {
	const ref = firebase.firestore().collection('artists');
	const query = ref.where('genre', '==', 'punk');
	const col = new Collection(ref);
	expect(col.query).toBeUndefined();
	col.query = query;
	expect(col.query).toBe(query);
});

test('reset', () => {
	const ref = firebase.firestore().collection('artists');
	const query = ref.where('genre', '==', 'punk');
	const col = new Collection();
	col.query = query;
	expect(col.query).toBe(query);
	col.query = undefined;
	expect(col.query).toBeUndefined();
});

test('set', async () => {
	expect.assertions(2);
	const col = new Collection('artists');
	col.query = col.ref.where('genre', '==', 'punk');
	expect(col.docs.length).toBe(0);
	await col.fetch();
	expect(col.docs.length).toBe(1);
});

test('no collection ref', () => {
	const ref = firebase.firestore().collection('artists');
	const query = ref.where('genre', '==', 'punk');
	const col = new Collection(undefined, {
		query: query
	});
	expect(col.query).toBe(query);
});

test('fetch', async () => {
	expect.assertions(1);
	const ref = firebase.firestore().collection('artists');
	const query = ref.where('genre', '==', 'punk');
	const col = new Collection(undefined, {
		query: query,
		mode: 'off'
	});
	await col.fetch();
	expect(col.docs.length).toBe(1);
});

test('reset & fetch', async () => {
	expect.assertions(2);
	const ref = firebase.firestore().collection('artists');
	const query = ref.where('genre', '==', 'punk');
	const col = new Collection(ref, {
		query: query,
		mode: 'off'
	});
	await col.fetch();
	expect(col.docs.length).toBe(1);
	col.query = undefined;
	await col.fetch();
	expect(col.docs.length).toBe(2);
});

test('re-fetch', async () => {
	expect.assertions(5);
	const col = new Collection('artists');
	col.query = col.ref.where('genre', '==', 'punk');
	expect(col.docs.length).toBe(0);
	await col.fetch();
	expect(col.docs.length).toBe(1);
	expect(col.docs[0].id).toBe('TheOffspring');
	col.query = col.ref.where('genre', '==', 'rock');
	await col.fetch();
	expect(col.docs.length).toBe(1);
	expect(col.docs[0].id).toBe('FooFighters');
});

test('observable', async () => {
	expect.assertions(2);
	const genre = observable.box('punk');
	const col = new Collection('artists');
	col.query = () => col.ref.where('genre', '==', genre.get());
	await col.fetch();
	expect(col.docs[0].id).toBe('TheOffspring');
	genre.set('rock');
	await col.fetch();
	expect(col.docs[0].id).toBe('FooFighters');
});
