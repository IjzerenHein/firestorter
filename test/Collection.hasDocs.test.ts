import { autorun } from 'mobx';

import { getContext, Collection, Mode } from '../src';

test('false when missing ref/path', async () => {
  const col = new Collection();
  expect(col.hasDocs).toBeFalsy();
});

test('false when collection empty', async () => {
  expect.assertions(1);
  const col = new Collection('artists', {
    mode: Mode.On,
    query: (ref) => getContext().query(ref, getContext().where('genre', '==', 'none')),
  });
  await col.ready();
  expect(col.hasDocs).toBeFalsy();
  col.mode = Mode.Off;
});

test('true when collection not empty', async () => {
  expect.assertions(1);
  const col = new Collection('artists', { mode: Mode.On });
  await col.ready();
  expect(col.hasDocs).toBeTruthy();
  col.mode = Mode.Off;
});

test('should not react when number of docs changes', async () => {
  expect.assertions(4);
  const col = new Collection('artists', {
    mode: Mode.On,
    query: (ref) => getContext().query(ref, getContext().where('genre', '>', '')),
  });
  let reactionCount = 0;
  const dispose = autorun(() => {
    if (col.hasDocs) {
      // just to test it
    }
    reactionCount += 1;
  });
  expect(reactionCount).toEqual(1);
  await col.ready();
  expect(reactionCount).toEqual(2);
  col.query = (ref) => getContext().query(ref, getContext().where('genre', '>', 'r'));
  await col.ready();
  expect(reactionCount).toEqual(2);
  col.query = (ref) => getContext().query(ref, getContext().where('genre', '>', 'z'));
  await col.ready();
  expect(reactionCount).toEqual(3);
  col.mode = Mode.Off;
  dispose();
});
