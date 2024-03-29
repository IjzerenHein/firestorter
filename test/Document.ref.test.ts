import { Document, getContext } from '../src';

test('no ref', () => {
  const doc = new Document();
  expect(doc.ref).toBeUndefined();
});

test('get ref', () => {
  const ref = getContext().doc('todos/todo');
  const doc = new Document(ref);
  expect(doc.ref).toBe(ref);
});

test('set ref', () => {
  const ref = getContext().doc('todos/todo');
  const doc = new Document();
  doc.ref = ref;
  expect(doc.ref).toBe(ref);
});

test('clear ref', () => {
  const ref = getContext().doc('todos/todo');
  const doc = new Document(ref);
  doc.ref = undefined;
  expect(doc.ref).toBeUndefined();
});

test('replace ref', () => {
  const ref = getContext().doc('todos/todo');
  const ref2 = getContext().doc('todos/todo2');
  const doc = new Document(ref);
  doc.ref = ref2;
  expect(doc.ref).toBe(ref2);
});
