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
  expect.assertions(7);
  const doc = new Document('artists/FooFighters');
  expect(doc.isLoading).toBe(false);
  expect(doc.isLoaded).toBe(false);
  expect(doc.hasData).toBe(false);
  await doc.fetch();
  expect(doc.isLoading).toBe(false);
  expect(doc.isLoaded).toBe(true);
  expect(doc.hasData).toBe(true);
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
  expect.assertions(7);
  const doc = new Document('artists/FooFighters');
  expect(doc.isLoading).toBe(false);
  expect(doc.isLoaded).toBe(false);
  doc.fetch();
  expect(doc.isLoading).toBe(true);
  expect(doc.isLoaded).toBe(false);
  await doc.ready();
  expect(doc.isLoading).toBe(false);
  expect(doc.isLoaded).toBe(true);
  expect(doc.data.topAlbumId).toBe('TheColourAndTheShape');
});
