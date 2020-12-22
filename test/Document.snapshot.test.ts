import { Document } from './init';

test('no values', () => {
  const doc = new Document();
  expect(doc.snapshot).toBeUndefined();
});

test('valid snapshot', async () => {
  expect.assertions(1);
  const doc = new Document('artists/FooFighters');
  await doc.fetch();
  expect(doc.snapshot).toBeDefined();
});

test('changed snapshot', async () => {
  expect.assertions(2);
  const doc = new Document('artists/FooFighters');
  await doc.fetch();
  const snapshot = doc.snapshot;
  expect(snapshot).toBeDefined();
  await doc.fetch();
  expect(doc.snapshot).not.toBe(snapshot);
});

/* test('initial snapshot', async () => {
	expect.assertions(1);
	const doc = new Document('artists/FooFighters');
	await doc.fetch();
	expect(doc.snapshot).toBeDefined();
}); */
