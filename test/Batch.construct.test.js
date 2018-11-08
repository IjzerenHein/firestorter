import { Batch, Document, firebase } from './init';

test('good args', () => {
  const batch = new Batch([{
    source:'test/path',
    operation:'set',
    data:{
      doc:'value',
      alt:'info'
    }
  }]);
  expect(batch).toBeDefined();
  expect(batch._operations).toHaveLength(1);
});

