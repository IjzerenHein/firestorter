import { struct } from 'superstruct';

import { Document } from '../src';

const ArtistSchema = struct({
  genre: 'string',
  memberCount: 'number?',
  members: 'object?',
  topAlbumId: 'string',
});

test('without schema', async () => {
  expect.assertions(2);
  // Create doc
  let doc = new Document('artists/TEMP');
  await doc.set({
    genre: 'jazz',
    topAlbumId: 'whoop',
  });

  // Check doc exists
  doc = new Document('artists/TEMP');
  await doc.fetch();
  expect(doc.hasData).toBe(true);

  // Delete doc
  await doc.delete();

  // Verify doc is deleted
  doc = new Document('artists/TEMP');
  await doc.fetch();
  expect(doc.hasData).toBe(false);
});

test('with schema', async () => {
  expect.assertions(2);
  // Create doc
  let doc = new Document('artists/TEMP', {
    schema: ArtistSchema,
  });
  await doc.set({
    genre: 'jazz',
    topAlbumId: 'whoop',
  });

  // Check doc exists
  doc = new Document('artists/TEMP', {
    schema: ArtistSchema,
  });
  await doc.fetch();
  expect(doc.hasData).toBe(true);

  // Delete doc
  await doc.delete();

  // Verify doc is deleted
  await doc.fetch();
  expect(doc.hasData).toBe(false);
});
