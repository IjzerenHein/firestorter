import { Collection, firebase, observable } from './init';

test('no query', () => {
	const col = new Collection();
	expect(col.query).toBeUndefined();
});

test('constructor - ref', () => {
	const ref = firebase.firestore().collection('artists');
	const query = ref.where('genre', '==', 'punk');
	const col = new Collection(ref, {
		query: query
	});
	expect(col.query).toBe(query);
});

test('constructor - function', () => {
	const query = (ref) => ref.where('genre', '==', 'punk');
	const col = new Collection('artists', {
		query: query
	});
	expect(col.query).toBe(query);
});

test('constructor - expect query function to be called once', () => {
	let callCount = 0;
	const query = (ref) => {
		callCount++;
		return ref.where('genre', '==', 'punk');
	};
	new Collection('artists', {
		query: query
	});
	expect(callCount).toBe(1);
});

test('update', () => {
	const query = (ref) => ref.where('genre', '==', 'punk');
	const col = new Collection('artists');
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

test('fetch', async () => {
	expect.assertions(2);
	const col = new Collection('artists', {
		query: (ref) => ref.where('genre', '==', 'punk')
	});
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

test('fetch 2', async () => {
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

	/*
  Seed expected data
   */
  firebase.firestore().doc('artists/TheOffspring').set({genre:'punk'});
  firebase.firestore().doc('artists/FooFighters').set({genre:'rock'});

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
	col.query = (ref) => ref.where('genre', '==', 'rock');
	await col.fetch();
	expect(col.docs.length).toBe(1);
	expect(col.docs[0].id).toBe('FooFighters');

  firebase.firestore().doc('artists/TheOffspring').delete();
  firebase.firestore().doc('artists/FooFighters').delete();
});

test('observable', async () => {
	expect.assertions(2);
	const genre = observable.box('punk');
	const col = new Collection('artists');
	col.query = (ref) => ref.where('genre', '==', genre.get());
	await col.fetch();
	expect(col.docs[0].id).toBe('TheOffspring');
	genre.set('rock');
	await col.fetch();
	expect(col.docs[0].id).toBe('FooFighters');
});

test('ref change', async () => {
	expect.assertions(3);
	const col = new Collection('artists', {
		query: (ref) => ref.where('genre', '==', 'punk')
	});
	await col.fetch();
	expect(col.docs[0].id).toBe('TheOffspring');
	col.path = 'artists2';
	await col.fetch();
	expect(col.docs.length).toBe(0);
	col.path = 'artists';
	await col.fetch();
	expect(col.docs.length).toBe(1);
});
