import { Document, firebase } from './init';

test('no args', () => {
	expect(new Document()).toBeDefined();
});

test('invalid ref (empty)', () => {
	expect(() => new Document(firebase.firestore().doc(''))).toThrow();
});

test('invalid ref (collection path)', () => {
	expect(() => new Document(firebase.firestore().doc('albums'))).toThrow();
});

test('valid ref', () => {
	expect(
		new Document(firebase.firestore().doc('albums/gunsandroses'))
	).toBeDefined();
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
