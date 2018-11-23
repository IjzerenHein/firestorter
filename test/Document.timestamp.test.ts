import { Document, getFirebase } from "./init";
import { struct } from "superstruct";

/*
const ArtistSchema = struct({
	genre: 'string',
	memberCount: 'number?',
	members: 'object?',
	topAlbumId: 'string',
});*/

test("write serverTimestamp", async () => {
    expect.assertions(3);

    // Clear doc
    let doc = new Document('settings/TimeStampTest');
    await doc.set({
        date: 'dummy',
    });
    await doc.fetch();
    expect(doc.data.date).toBe('dummy');

    // Set server timestamp
    doc = new Document('settings/TimeStampTest');
    await doc.set({
        date: getFirebase().firestore.FieldValue.serverTimestamp()
    });
    await doc.fetch();
    expect(doc.data.date).toHaveProperty('seconds');
    expect(doc.data.date).toHaveProperty('nanoseconds');
});