import { Document, firebase } from './init';
import { Mode } from '../src/Types';

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

test('empty options', () => {
	expect(new Document(undefined, {})).toBeDefined();
});

test('all options', () => {
	expect(new Document(undefined, {
		debug: false,
		debugName: 'test',
		mode: Mode.Auto,
		snapshot: {
			data: () => undefined,
			exists: false,
			get: (fieldPath: string) => undefined,
			id: "",
			isEqual: () => false,
			metadata: undefined,
			ref: undefined
		},
		snapshotOptions: {
			serverTimestamps: 'estimate'
		},

	})).toBeDefined();
});
