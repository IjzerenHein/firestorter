import { Document, firebase, getFirebase } from './init';
import { struct } from 'superstruct';

const ArtistSchema = struct({
	genre: 'string',
	topAlbumId: 'string',
	memberCount: 'number?',
	members: 'object?'
});

test('update field', async () => {
	expect.assertions(2);
	const doc = new Document('artists/FooFighters');
	await doc.update({
		memberCount: 4
	});
	expect(doc.data.memberCount).toBeUndefined();
	await doc.fetch();
	expect(doc.data.memberCount).toBe(4);
});

test('update field with schema', async () => {
	expect.assertions(1);
	const doc = new Document('artists/FooFighters', {
		schema: ArtistSchema
	});
	await doc.fetch();
	await doc.update({
		memberCount: 3
	});
	await doc.fetch();
	expect(doc.data.memberCount).toBe(3);
});

test('update field-path with schema', async () => {
	expect.assertions(1);
	const doc = new Document('artists/FooFighters', {
		schema: ArtistSchema
	});
	await doc.fetch();
	await doc.update({
		'members.leadVocalist': 'Dave Grohl'
	});
	await doc.fetch();
	expect(doc.data.members.leadVocalist).toBe('Dave Grohl');
});

test('delete field with schema', async () => {
	expect.assertions(2);
	const doc = new Document('artists/FooFighters', {
		schema: ArtistSchema
	});
	await doc.fetch();
	expect(doc.data.memberCount).toBe(3);
	await doc.update({
		memberCount: getFirebase().firestore.FieldValue.delete()
	});
	await doc.fetch();
	expect(doc.data.memberCount).toBeUndefined();
});

test('delete field-path with schema', async () => {
	expect.assertions(1);
	const doc = new Document('artists/FooFighters', {
		schema: ArtistSchema
	});
	await doc.fetch();
	await doc.update({
		'members.leadVocalist': firebase.firestore.FieldValue.delete()
	});
	await doc.fetch();
	expect(doc.data.members.leadVocalist).toBeUndefined();
});

test('update field with invalid schema', async () => {
	expect.assertions(1);
	const doc = new Document('artists/FooFighters', {
		schema: ArtistSchema
	});
	await doc.fetch();
	try {
		await doc.update({
			blaat: 10
		});
	} catch (e) {
		expect(e).toEqual(new Error('Invalid value at "blaat" for Document with id "FooFighters": Expected a value of type `undefined` for `blaat` but received `10`.'));
	}
});
