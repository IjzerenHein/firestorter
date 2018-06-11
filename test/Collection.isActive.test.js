import { Collection, autorun } from './init';

describe('off', () => {
	test('construct no ref', () => {
		const col = new Collection(undefined, { mode: 'off' });
		expect(col.isActive).toBe(false);
	});

	test('construct with ref', () => {
		const col = new Collection('todos', { mode: 'off' });
		expect(col.isActive).toBe(false);
	});

	test('no ref, observed', () => {
		const col = new Collection('todos', { mode: 'off' });
		const dispose = autorun(() => {
			col.docs;
		});
		expect(col.isActive).toBe(false);
		dispose();
		expect(col.isActive).toBe(false);
	});
});

describe('on', () => {
	test('construct no ref', () => {
		const col = new Collection(undefined, { mode: 'on' });
		expect(col.isActive).toBe(false);
	});

	test('construct with ref', () => {
		const col = new Collection('todos', { mode: 'on' });
		expect(col.isActive).toBe(true);
		col.ref = undefined;
		expect(col.isActive).toBe(false);
	});

	test('reset ref', () => {
		const col = new Collection('todos', { mode: 'on' });
		col.path = undefined;
		expect(col.isActive).toBe(false);
	});

	test('set', () => {
		const col = new Collection('todos');
		col.mode = 'on';
		expect(col.isActive).toBe(true);
		col.mode = 'off';
		expect(col.isActive).toBe(false);
	});
});

describe('auto', () => {
	test('no ref', () => {
		const col = new Collection();
		expect(col.isActive).toBe(false);
	});

	test('no ref, observed', () => {
		const col = new Collection();
		expect(col.isActive).toBe(false);
		const dispose = autorun(() => {
			col.docs.length;
		});
		expect(col.isActive).toBe(false);
		dispose();
		expect(col.isActive).toBe(false);
	});

	test('ref, observed', () => {
		const col = new Collection('todos');
		expect(col.isActive).toBe(false);
		const dispose = autorun(() => {
			col.docs.length;
		});
		expect(col.isActive).toBe(true);
		dispose();
		expect(col.isActive).toBe(false);
	});

	test('reset ref', () => {
		const col = new Collection('todos');
		expect(col.isActive).toBe(false);
		const dispose = autorun(() => {
			col.docs.length;
		});
		expect(col.isActive).toBe(true);
		col.ref = undefined;
		expect(col.isActive).toBe(false);
		col.ref = 'todos';
		expect(col.isActive).toBe(true);
		dispose();
		expect(col.isActive).toBe(false);
	});

	test('change mode', () => {
		const col = new Collection('todos');
		expect(col.isActive).toBe(false);
		const dispose = autorun(() => {
			col.docs.length;
		});
		expect(col.isActive).toBe(true);
		col.mode = 'off';
		expect(col.isActive).toBe(false);
		col.mode = 'auto';
		expect(col.isActive).toBe(true);
		dispose();
		expect(col.isActive).toBe(false);
	});
});
