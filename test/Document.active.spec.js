import { Document, autorun } from './init';

describe('off', () => {
	test('construct no ref', () => {
		const doc = new Document(undefined, { mode: 'off' });
		expect(doc.active).toBe(false);
	});

	test('construct with ref', () => {
		const doc = new Document('todos/todo', { mode: 'off' });
		expect(doc.active).toBe(false);
	});

	test('no ref, observed', () => {
		const doc = new Document('todos/todo', { mode: 'off' });
		const dispose = autorun(() => {
			doc.data;
		});
		expect(doc.active).toBe(false);
		dispose();
		expect(doc.active).toBe(false);
	});
});

describe('on', () => {
	test('construct no ref', () => {
		const doc = new Document(undefined, { mode: 'on' });
		expect(doc.active).toBe(false);
	});

	test('construct with ref', () => {
		const doc = new Document('todos/todo', { mode: 'on' });
		expect(doc.active).toBe(true);
		doc.ref = undefined;
		expect(doc.active).toBe(false);
	});

	test('reset ref', () => {
		const doc = new Document('todos/todo', { mode: 'on' });
		doc.path = undefined;
		expect(doc.active).toBe(false);
	});

	test('set', () => {
		const doc = new Document('todos/todo');
		doc.mode = 'on';
		expect(doc.active).toBe(true);
		doc.mode = 'off';
		expect(doc.active).toBe(false);
	});
});

describe('auto', () => {
	test('no ref', () => {
		const doc = new Document();
		expect(doc.active).toBe(false);
	});

	test('no ref, observed', () => {
		const doc = new Document();
		expect(doc.active).toBe(false);
		const dispose = autorun(() => {
			doc.data;
		});
		expect(doc.active).toBe(false);
		dispose();
		expect(doc.active).toBe(false);
	});

	test('ref, observed', () => {
		const doc = new Document('todos/todo');
		expect(doc.active).toBe(false);
		const dispose = autorun(() => {
			doc.data;
		});
		expect(doc.active).toBe(true);
		dispose();
		expect(doc.active).toBe(false);
	});

	test('reset ref', () => {
		const doc = new Document('todos/todo');
		expect(doc.active).toBe(false);
		const dispose = autorun(() => {
			doc.data;
		});
		expect(doc.active).toBe(true);
		doc.ref = undefined;
		expect(doc.active).toBe(false);
		doc.ref = 'todos/todo';
		expect(doc.active).toBe(true);
		dispose();
		expect(doc.active).toBe(false);
	});

	test('change mode', () => {
		const doc = new Document('todos/todo');
		expect(doc.active).toBe(false);
		const dispose = autorun(() => {
			doc.data;
		});
		expect(doc.active).toBe(true);
		doc.mode = 'off';
		expect(doc.active).toBe(false);
		doc.mode = 'auto';
		expect(doc.active).toBe(true);
		dispose();
		expect(doc.active).toBe(false);
	});
});
