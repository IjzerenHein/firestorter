import { Collection, getContext } from '../src';

test('no ref', () => {
  const col = new Collection();
  expect(col.ref).toBeUndefined();
});

test('get ref', () => {
  const ref = getContext().collection('todos');
  const col = new Collection(ref);
  expect(col.ref).toBe(ref);
});

test('set ref', () => {
  const ref = getContext().collection('todos');
  const col = new Collection();
  col.ref = ref;
  expect(col.ref).toBe(ref);
});

test('clear ref', () => {
  const ref = getContext().collection('todos/todo/sup');
  const col = new Collection(ref);
  col.ref = undefined;
  expect(col.ref).toBeUndefined();
});

test('replace ref', () => {
  const ref = getContext().collection('todos');
  const ref2 = getContext().collection('todos2');
  const col = new Collection(ref);
  col.ref = ref2;
  expect(col.ref).toBe(ref2);
});
