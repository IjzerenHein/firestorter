import { Document } from './init';
import { struct } from 'superstruct';

const ArtistSchema = struct({
	genre: 'string',
	topAlbumId: 'string',
	memberCount: 'number?'
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
