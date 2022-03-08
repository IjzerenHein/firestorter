import { Timestamp, serverTimestamp } from 'firebase/firestore';
import { struct } from 'superstruct';

import { Document, isTimestamp } from '../src';

interface ISetting {
  date: {
    seconds: number;
    nanoseconds: number;
  };
}

const TimestampSchema = struct({
  date: isTimestamp,
});

test('write serverTimestamp', async () => {
  expect.assertions(3);

  // Clear doc
  let doc = new Document<ISetting>('settings/ServerTimeStampTest');
  await doc.set({
    date: 'dummy',
  });
  await doc.fetch();
  expect(doc.data.date).toBe('dummy');

  // Set server timestamp
  doc = new Document('settings/ServerTimeStampTest');
  await doc.set({
    date: serverTimestamp(),
  });
  await doc.fetch();
  expect(doc.data.date).toHaveProperty('seconds');
  expect(doc.data.date).toHaveProperty('nanoseconds');
});

test('write date with schema', async () => {
  expect.assertions(4);
  const doc = new Document<ISetting>('settings/TimeStampTest', {
    schema: TimestampSchema,
  });
  const date = new Date();
  await doc.set({
    date,
  });
  await doc.fetch();
  expect(doc.data.date).toHaveProperty('seconds');
  expect(doc.data.date).toHaveProperty('nanoseconds');
  const timestamp = Timestamp.fromDate(date);
  expect(doc.data.date.seconds).toBe(timestamp.seconds);
  expect(doc.data.date.nanoseconds).toBe(timestamp.nanoseconds);
});

test('write timestamp with schema', async () => {
  expect.assertions(4);
  const doc = new Document<ISetting>('settings/TimeStampTest', {
    schema: TimestampSchema,
  });
  const timestamp = Timestamp.fromDate(new Date());
  await doc.set({
    date: timestamp,
  });
  await doc.fetch();
  expect(doc.data.date).toHaveProperty('seconds');
  expect(doc.data.date).toHaveProperty('nanoseconds');
  expect(doc.data.date.seconds).toBe(timestamp.seconds);
  expect(doc.data.date.nanoseconds).toBe(timestamp.nanoseconds);
});
