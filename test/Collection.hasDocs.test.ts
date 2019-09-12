import { autorun, Collection } from "./init";

test("false when missing ref/path", async () => {
	const col = new Collection(undefined, { mode: "off" });
	expect(col.hasDocs).toBeFalsy();
});

test("false when collection empty", async () => {
	expect.assertions(1);
	const col = new Collection("artists", {
		mode: "off",
		query: ref => ref.where("genre", "==", "none")
	});
	await col.fetch();
	expect(col.hasDocs).toEqual(false);
});

test("true when collection not empty", async () => {
	expect.assertions(1);
	const col = new Collection("artists", { mode: "off" });
	await col.fetch();
	expect(col.hasDocs).toEqual(true);
});

test("should not react when number of docs changes", async () => {
	expect.assertions(4);
	const col = new Collection("artists", {
		mode: "on",
		query: ref => ref.where("genre", ">", "")
	});
	let reactionCount = 0;
	const dispose = autorun(() => {
		if (col.hasDocs) {
			// just to test it
		}
		reactionCount += 1;
	});
	expect(reactionCount).toEqual(1);
	await col.ready();
	expect(reactionCount).toEqual(2);
	col.query = ref => ref.where("genre", ">", "r");
	await col.ready();
	expect(reactionCount).toEqual(2);
	col.query = ref => ref.where("genre", ">", "z");
	await col.ready();
	expect(reactionCount).toEqual(3);
	col.mode = "off";
	dispose();
});
