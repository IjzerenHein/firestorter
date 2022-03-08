import { Collection } from '../src';

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
  expect.assertions(5);
  const col = new Collection('artists');
  expect(col.isLoading).toBe(false);
  expect(col.isLoaded).toBe(false);
  await col.fetch();
  expect(col.isLoading).toBe(false);
  expect(col.isLoaded).toBe(true);
  const docs = col.docs.filter((doc) => doc.id !== 'TEMP');
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
  expect.assertions(7);
  const col = new Collection('artists');
  expect(col.isLoading).toBe(false);
  expect(col.isLoaded).toBe(false);
  col.fetch();
  expect(col.isLoading).toBe(true);
  expect(col.isLoaded).toBe(false);
  await col.ready();
  expect(col.isLoading).toBe(false);
  expect(col.isLoaded).toBe(true);
  const docs = col.docs.filter((doc) => doc.id !== 'TEMP');
  expect(docs.length).toBe(2);
});
