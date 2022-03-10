import { Mode, Document, getContext } from '../src';

test('no args', () => {
  expect(new Document()).toBeDefined();
});

test('invalid ref (empty)', () => {
  expect(() => new Document(getContext().doc(''))).toThrow();
});

test('invalid ref (collection path)', () => {
  expect(() => new Document(getContext().doc('albums'))).toThrow();
});

test('valid ref', () => {
  expect(new Document(getContext().doc('albums/gunsandroses'))).toBeDefined();
});

test('invalid path (empty string)', () => {
  expect(() => new Document('')).toThrow();
});

test('invalid path (collection path)', () => {
  expect(() => new Document('albums')).toThrow();
});

test('valid path', () => {
  expect(new Document('albums/gunsandroses')).toBeDefined();
});

test('empty options', () => {
  expect(new Document(undefined, {})).toBeDefined();
});

test('all options', () => {
  expect(
    new Document(undefined, {
      debug: false,
      debugName: 'test',
      mode: Mode.Auto,
      snapshot: {
        data: () => undefined,
        exists: () => false,
        get: (_fieldPath: string) => undefined,
        id: '',
        // @ts-ignore Type 'undefined' is not assignable to type 'SnapshotMetadata'
        metadata: undefined,
        // @ts-ignore Type 'undefined' is not assignable to type 'DocumentReference<DocumentData>'
        ref: undefined,
      },
      snapshotOptions: {
        serverTimestamps: 'estimate',
      },
    })
  ).toBeDefined();
});
