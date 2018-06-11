import { Document, autorun } from './init';

describe('off', () => {
	test('construct no ref', () => {
		const doc = new Document(undefined, { mode: 'off' });
		expect(doc.isActive).toBe(false);
	});

	test('construct with ref', () => {
		const doc = new Document('todos/todo', { mode: 'off' });
		expect(doc.isActive).toBe(false);
	});

	test('no ref, observed', () => {
		const doc = new Document('todos/todo', { mode: 'off' });
		const dispose = autorun(() => {
			doc.data;
		});
		expect(doc.isActive).toBe(false);
		dispose();
		expect(doc.isActive).toBe(false);
	});
});

describe('on', () => {
	test('construct no ref', () => {
		const doc = new Document(undefined, { mode: 'on' });
		expect(doc.isActive).toBe(false);
	});

	test('construct with ref', () => {
		const doc = new Document('todos/todo', { mode: 'on' });
		expect(doc.isActive).toBe(true);
		doc.ref = undefined;
		expect(doc.isActive).toBe(false);
	});

	test('reset ref', () => {
		const doc = new Document('todos/todo', { mode: 'on' });
		doc.path = undefined;
		expect(doc.isActive).toBe(false);
	});

	test('set', () => {
		const doc = new Document('todos/todo');
		doc.mode = 'on';
		expect(doc.isActive).toBe(true);
		doc.mode = 'off';
		expect(doc.isActive).toBe(false);
	});
});

describe('auto', () => {
	test('no ref', () => {
		const doc = new Document();
		expect(doc.isActive).toBe(false);
	});

	test('no ref, observed', () => {
		const doc = new Document();
		expect(doc.isActive).toBe(false);
		const dispose = autorun(() => {
			doc.data;
		});
		expect(doc.isActive).toBe(false);
		dispose();
		expect(doc.isActive).toBe(false);
	});

	test('ref, observed', () => {
		const doc = new Document('todos/todo');
		expect(doc.isActive).toBe(false);
		const dispose = autorun(() => {
			doc.data;
		});
		expect(doc.isActive).toBe(true);
		dispose();
		expect(doc.isActive).toBe(false);
	});

	test('reset ref', () => {
		const doc = new Document('todos/todo');
		expect(doc.isActive).toBe(false);
		const dispose = autorun(() => {
			doc.data;
		});
		expect(doc.isActive).toBe(true);
		doc.ref = undefined;
		expect(doc.isActive).toBe(false);
		doc.ref = 'todos/todo';
		expect(doc.isActive).toBe(true);
		dispose();
		expect(doc.isActive).toBe(false);
	});

	test('change mode', () => {
		const doc = new Document('todos/todo');
		expect(doc.isActive).toBe(false);
		const dispose = autorun(() => {
			doc.data;
		});
		expect(doc.isActive).toBe(true);
		doc.mode = 'off';
		expect(doc.isActive).toBe(false);
		doc.mode = 'auto';
		expect(doc.isActive).toBe(true);
		dispose();
		expect(doc.isActive).toBe(false);
	});
});
