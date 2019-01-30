import { Document } from "./init";

test("no generic type specified", () => {
	const doc = new Document();
});

test("default generic type specified", () => {
	type TodoType = {
		finished: boolean;
		message: string;
	};
	const doc = new Document<TodoType>();
	doc.data.finished;
});
