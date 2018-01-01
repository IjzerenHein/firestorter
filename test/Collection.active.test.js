import { Collection, autorun } from './init';

describe('off', () => {
	test('construct no ref', () => {
		const col = new Collection(undefined, { mode: 'off' });
		expect(col.active).toBe(false);
	});

	test('construct with ref', () => {
		const col = new Collection('todos', { mode: 'off' });
		expect(col.active).toBe(false);
	});

	test('no ref, observed', () => {
		const col = new Collection('todos', { mode: 'off' });
		const dispose = autorun(() => {
			col.docs;
		});
		expect(col.active).toBe(false);
		dispose();
		expect(col.active).toBe(false);
	});
});

describe('on', () => {
	test('construct no ref', () => {
		const col = new Collection(undefined, { mode: 'on' });
		expect(col.active).toBe(false);
	});

	test('construct with ref', () => {
		const col = new Collection('todos', { mode: 'on' });
		expect(col.active).toBe(true);
		col.ref = undefined;
		expect(col.active).toBe(false);
	});

	test('reset ref', () => {
		const col = new Collection('todos', { mode: 'on' });
		col.path = undefined;
		expect(col.active).toBe(false);
	});

	test('set', () => {
		const col = new Collection('todos');
		col.mode = 'on';
		expect(col.active).toBe(true);
		col.mode = 'off';
		expect(col.active).toBe(false);
	});
});

describe('auto', () => {
	test('no ref', () => {
		const col = new Collection();
		expect(col.active).toBe(false);
	});

	test('no ref, observed', () => {
		const col = new Collection();
		expect(col.active).toBe(false);
		const dispose = autorun(() => {
			col.docs.length;
		});
		expect(col.active).toBe(false);
		dispose();
		expect(col.active).toBe(false);
	});

	test('ref, observed', () => {
		const col = new Collection('todos');
		expect(col.active).toBe(false);
		const dispose = autorun(() => {
			col.docs.length;
		});
		expect(col.active).toBe(true);
		dispose();
		expect(col.active).toBe(false);
	});

	test('reset ref', () => {
		const col = new Collection('todos');
		expect(col.active).toBe(false);
		const dispose = autorun(() => {
			col.docs.length;
		});
		expect(col.active).toBe(true);
		col.ref = undefined;
		expect(col.active).toBe(false);
		col.ref = 'todos';
		expect(col.active).toBe(true);
		dispose();
		expect(col.active).toBe(false);
	});

	test('change mode', () => {
		const col = new Collection('todos');
		expect(col.active).toBe(false);
		const dispose = autorun(() => {
			col.docs.length;
		});
		expect(col.active).toBe(true);
		col.mode = 'off';
		expect(col.active).toBe(false);
		col.mode = 'auto';
		expect(col.active).toBe(true);
		dispose();
		expect(col.active).toBe(false);
	});
});
