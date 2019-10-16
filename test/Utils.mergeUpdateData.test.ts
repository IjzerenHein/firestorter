import { firebase, mergeUpdateData } from "./init";

const TEST_DATA = {
	field1: 1
};

test("export exists", () => {
	expect(mergeUpdateData).toBeDefined();
});

test("replace field", () => {
	expect(
		mergeUpdateData(TEST_DATA, {
			field1: 2
		})
	).toEqual({
		...TEST_DATA,
		field1: 2
	});
});

test("append field", () => {
	expect(
		mergeUpdateData(TEST_DATA, {
			field2: 2
		})
	).toEqual({
		...TEST_DATA,
		field2: 2
	});
});

test("append multiple field", () => {
	expect(
		mergeUpdateData(TEST_DATA, {
			field2: 2,
			field3: 3
		})
	).toEqual({
		...TEST_DATA,
		field2: 2,
		field3: 3
	});
});

test("append object", () => {
	expect(
		mergeUpdateData(TEST_DATA, {
			field2: {
				foo: "bar"
			}
		})
	).toEqual({
		...TEST_DATA,
		field2: {
			foo: "bar"
		}
	});
});

test("append field path", () => {
	expect(
		mergeUpdateData(TEST_DATA, {
			"field2.foo": "bar"
		})
	).toEqual({
		...TEST_DATA,
		field2: {
			foo: "bar"
		}
	});
});

test("delete field", () => {
	expect(
		mergeUpdateData(TEST_DATA, {
			field1: firebase.firestore.FieldValue.delete()
		})
	).toEqual({});
});

/*test("default generic type specified", () => {
	type TodoType = {
		finished: boolean;
		message: string;
	};
	const doc = new Document<TodoType>();
	doc.data.finished;
});*/
