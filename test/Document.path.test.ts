import { Document } from './init';

test('no path', () => {
  const doc = new Document();
  expect(doc.path).toBeUndefined();
  expect(doc.ref).toBeUndefined();
});

test('get path', () => {
  const doc = new Document('todos/todo');
  expect(doc.path).toBe('todos/todo');
  expect(doc.ref).toBeDefined();
});

test('set path', () => {
  const doc = new Document();
  doc.path = 'todos/todo';
  expect(doc.path).toBe('todos/todo');
  expect(doc.ref).toBeDefined();
});

test('clear path', () => {
  const doc = new Document('todos/todo');
  doc.path = undefined;
  expect(doc.path).toBeUndefined();
  expect(doc.ref).toBeUndefined();
});

test('replace ref', () => {
  const doc = new Document('todos/todo');
  doc.path = 'todos/todo2';
  expect(doc.path).toBe('todos/todo2');
  expect(doc.ref).toBeDefined();
});

test('change path to unknown document', async () => {
  expect.assertions(2);
  const doc = new Document('artists/TheOffspring');
  await doc.fetch();
  expect(doc.hasData).toBe(true);
  doc.path = 'readOnly/doesnotexist';
  await doc.fetch();
  expect(doc.hasData).toBe(false);
});

test('change path to inaccessible document', async () => {
  expect.assertions(3);
  const doc = new Document('artists/TheOffspring');
  await doc.fetch();
  expect(doc.hasData).toBe(true);
  doc.path = 'forbidden/cantReadMe';
  try {
    await doc.fetch();
  } catch (err) {
    expect(err).toBeDefined();
  }
  expect(doc.hasData).toBe(false);
});
