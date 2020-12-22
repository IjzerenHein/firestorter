import { struct } from 'superstruct';

import { Collection, Document } from './init';

const schema = struct({
  id: 'number',
});

class TodoDoc extends Document {
  constructor(source, options) {
    super(source, {
      ...(options || {}),
      schema,
    });
  }
}

test('fail on missing ref/path', async () => {
  expect.assertions(1);
  const col = new Collection();
  try {
    await col.add({ test: true });
  } catch (err) {
    expect(err).toBeDefined();
  }
});

test('fail on invalid doc schema', async () => {
  expect.assertions(1);
  const col = new Collection('todos', {
    createDocument: (source, options) => new TodoDoc(source, options),
  });
  try {
    await col.add({ id: 'not a number' });
  } catch (err) {
    expect(err).toBeDefined();
  }
});
