import { Collection, Document } from './init';
import { autorun } from 'mobx';

interface IBigData {
  number: number;
}

/* test.skip("insert", async () => {
	expect.assertions(1);
	const col = new Collection("bigData");
	for (let i = 0; i < 500; i++) {
		await col.add({
			number: i + 1000
		});
		console.log(i);
	}
}, 1000000000);*/

test.skip('unobserve', async () => {
  expect.assertions(1);
  const col = new Collection<Document<IBigData>>('bigData');
  const dispose = autorun(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { length } = col.docs;
    length;
    col.docs.reduce((c, d) => c + d.data.number || 0, 0);
  });
  await col.ready();
  expect(col.docs.length).toBe(1602);
  dispose();
});
