import { Batch, Document } from './init';

test('set operations',async ()=> {
  //set several
  const batch = new Batch([{
    source: 'test/path',
    operation: 'set',
    data: {
      doc: 'value',
      alt: 'info'
    }
  }, {
    source: 'test/path1',
    operation: 'set',
    data: {
      doc: 'value1',
      alt: 'info1'
    }
  }, {
    source: 'test/path2',
    operation: 'set',
    data: {
      doc: 'value2',
      alt: 'info2'
    }
  }]);

  await batch.run();
  const doc = new Document('test/path');
  await doc.fetch();
  expect(doc.data.doc).toBe('value');

  const doc1 = new Document('test/path1');
  await doc1.fetch();
  expect(doc1.data.doc).toBe('value1');

  const doc2 = new Document('test/path2');
  await doc2.fetch();
  expect(doc2.data.doc).toBe('value2');
});

test('mixed operations',async ()=> {

  const doc = new Document('test/path');
  await doc.fetch();

  const doc1 = new Document('test/path1');
  await doc1.fetch();

  //set more + update + delete
  const batch = new Batch([{
    source:doc,
    operation:'update',
    data:{
      doc:'another_value',
    }
  },{
    source:doc1,
    operation:'delete'
  },{
    source:'test/path3',
    operation:'set',
    data:{
      doc:'value3',
      alt:'info3'
    }
  }]);

  await batch.run();
  const docUpdate = new Document('test/path');
  await docUpdate.fetch();
  expect(docUpdate.data.doc).toBe('another_value');

  const doc1Delete = new Document('test/path1');
  await doc1Delete.fetch();
  expect(doc1Delete.data.doc).toBeUndefined();

  const doc3 = new Document('test/path3');
  await doc3.fetch();
  expect(doc3.data.doc).toBe('value3');
});

test('delete operations', async () => {

  const doc = new Document('test/path');
  await doc.fetch();

  //doc1 deleted in previous test

  const doc2 = new Document('test/path2');
  await doc2.fetch();

  const doc3 = new Document('test/path3');
  await doc3.fetch();

  //delete all
  const batch = new Batch([{
    source:doc,
    operation:'delete'
  },{
    source:doc2,
    operation:'delete'
  },{
    source:doc3,
    operation:'delete'
  }
  ]);

  await batch.run();

  const docDelete = new Document('test/path');
  await docDelete.fetch();
  expect(docDelete.data.doc).toBeUndefined();

  const doc2Delete = new Document('test/path2');
  await doc2Delete.fetch();
  expect(doc2Delete.data.doc).toBeUndefined();

  const doc3Delete = new Document('test/path3');
  await doc3Delete.fetch();
  expect(doc3Delete.data.doc).toBeUndefined();
})
