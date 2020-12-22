import { Collection, firebase } from './init';

test('no ref', () => {
  const col = new Collection();
  expect(col.ref).toBeUndefined();
});

test('get ref', () => {
  const ref = firebase.firestore().collection('todos');
  const col = new Collection(ref);
  expect(col.ref).toBe(ref);
});

test('set ref', () => {
  const ref = firebase.firestore().collection('todos');
  const col = new Collection();
  col.ref = ref;
  expect(col.ref).toBe(ref);
});

test('clear ref', () => {
  const ref = firebase.firestore().collection('todos/todo/sup');
  const col = new Collection(ref);
  col.ref = undefined;
  expect(col.ref).toBeUndefined();
});

test('replace ref', () => {
  const ref = firebase.firestore().collection('todos');
  const ref2 = firebase.firestore().collection('todos2');
  const col = new Collection(ref);
  col.ref = ref2;
  expect(col.ref).toBe(ref2);
});
