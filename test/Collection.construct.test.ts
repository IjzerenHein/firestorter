import { Collection, getContext } from '../src';

test('no args', () => {
  expect(new Collection()).toBeDefined();
});

test('invalid ref (empty)', () => {
  expect(() => new Collection(getContext().collection(''))).toThrow();
});

test('invalid ref (document path)', () => {
  expect(() => new Collection(getContext().collection('albums/album'))).toThrow();
});

test('valid ref', () => {
  expect(new Collection(getContext().collection('albums'))).toBeDefined();
});

test('invalid path (empty string)', () => {
  expect(() => new Collection('')).toThrow();
});

test('invalid path (document path)', () => {
  expect(() => new Collection('albums/gunsandroses')).toThrow();
});

test('valid path', () => {
  expect(new Collection('artists/gunsandroses/albums')).toBeDefined();
});
