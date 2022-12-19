import { runInAction, observable } from 'mobx';

import { Mode, Collection, getContext, CollectionQuery } from '../src';

test('no query', () => {
  const col = new Collection();
  expect(col.query).toBeUndefined();
});

test('constructor - ref', () => {
  const ref = getContext().collection('artists');
  const query = getContext().query(ref, getContext().where('genre', '==', 'punk'));
  const col = new Collection(ref, {
    query,
  });
  expect(col.query).toBe(query);
});

test('constructor - function', () => {
  const query: CollectionQuery = (ref) =>
    getContext().query(ref, getContext().where('genre', '==', 'punk'));
  const col = new Collection('artists', {
    query,
  });
  expect(col.query).toBe(query);
});

test('constructor - expect query function to be called once', () => {
  let callCount = 0;
  const query: CollectionQuery = (ref) => {
    callCount++;
    return getContext().query(ref, getContext().where('genre', '==', 'punk'));
  };
  const col = new Collection('artists', {
    query,
  });
  col.id;
  expect(callCount).toBe(1);
});

test('update', () => {
  const query: CollectionQuery = (ref) =>
    getContext().query(ref, getContext().where('genre', '==', 'punk'));
  const col = new Collection('artists');
  expect(col.query).toBeUndefined();
  col.query = query;
  expect(col.query).toBe(query);
});

test('reset', () => {
  const ref = getContext().collection('artists');
  const query = getContext().query(ref, getContext().where('genre', '==', 'punk'));
  const col = new Collection();
  col.query = query;
  expect(col.query).toBe(query);
  col.query = undefined;
  expect(col.query).toBeUndefined();
});

test('fetch', async () => {
  expect.assertions(2);
  const col = new Collection('artists', {
    query: (ref) => getContext().query(ref, getContext().where('genre', '==', 'punk')),
  });
  expect(col.docs.length).toBe(0);
  await col.fetch();
  expect(col.docs.length).toBe(1);
});

test('no collection ref', () => {
  const ref = getContext().collection('artists');
  const query = getContext().query(ref, getContext().where('genre', '==', 'punk'));
  const col = new Collection(undefined, {
    query,
  });
  expect(col.query).toBe(query);
});

test('fetch 2', async () => {
  expect.assertions(1);
  const ref = getContext().collection('artists');
  const query = getContext().query(ref, getContext().where('genre', '==', 'punk'));
  const col = new Collection(undefined, {
    mode: Mode.Off,
    query,
  });
  await col.fetch();
  expect(col.docs.length).toBe(1);
});

test('reset & fetch', async () => {
  expect.assertions(2);
  const ref = getContext().collection('artists');
  const query = getContext().query(ref, getContext().where('genre', '==', 'punk'));
  const col = new Collection(ref, {
    mode: Mode.Off,
    query,
  });
  await col.fetch();
  expect(col.docs.length).toBe(1);
  col.query = undefined;
  await col.fetch();
  expect(col.docs.length).toBeGreaterThanOrEqual(2);
});

test('re-fetch', async () => {
  expect.assertions(5);
  const col = new Collection('artists');
  col.query = getContext().query(col.ref!, getContext().where('genre', '==', 'punk'));
  expect(col.docs.length).toBe(0);
  await col.fetch();
  expect(col.docs.length).toBe(1);
  expect(col.docs[0].id).toBe('TheOffspring');
  col.query = (ref) => getContext().query(ref, getContext().where('genre', '==', 'rock'));
  await col.fetch();
  expect(col.docs.length).toBe(1);
  expect(col.docs[0].id).toBe('FooFighters');
});

test('observable', async () => {
  expect.assertions(2);
  const genre = observable.box('punk');
  const col = new Collection('artists');
  col.query = (ref) => getContext().query(ref, getContext().where('genre', '==', genre.get()));
  await col.fetch();
  expect(col.docs[0].id).toBe('TheOffspring');
  runInAction(() => genre.set('rock'));
  await col.fetch();
  expect(col.docs[0].id).toBe('FooFighters');
});

test('ref change', async () => {
  expect.assertions(3);
  const col = new Collection('artists', {
    query: (ref) => getContext().query(ref, getContext().where('genre', '==', 'punk')),
  });
  await col.fetch();
  expect(col.docs[0].id).toBe('TheOffspring');
  col.path = 'emptyCollection';
  await col.fetch();
  expect(col.docs.length).toBe(0);
  col.path = 'artists';
  await col.fetch();
  expect(col.docs.length).toBe(1);
});

test('disabled', async () => {
  expect.assertions(3);
  const col = new Collection('artists', {
    query: (_ref) => null,
  });
  try {
    await col.fetch();
  } catch (err) {
    expect(err).toBeDefined();
  }
  expect(col.docs.length).toBe(0);
  col.query = (_ref) => undefined;
  await col.fetch();
  expect(col.docs.length).toBe(2);
});
