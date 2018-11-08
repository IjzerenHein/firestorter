import { Batch, Document, firebase } from './init';

test('no args', () => {
  //expect(()=>new Batch()).toThrow();
});

/*
Unsure why flow isnt erroring on these dodgy types
 */
test('bad args', () => {
  //expect(()=>new Batch({})).toThrow();
  //expect(()=>new Batch([{source:[],operation:'set'}])).toThrow();
  //expect(()=>new Batch([{source:'a/path',operation:'fart'}])).toThrow();
});

test('good args', () => {
  const batch = new Batch([{
    source:'test/path',
    operation:'set',
    data:{
      doc:'value',
      alt:'info'
    }
  }]);
  expect(batch._operations).toHaveLength(1);
});

