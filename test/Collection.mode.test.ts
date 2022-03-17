import { Collection, Mode } from '../src';

describe('construct', () => {
  test('default is auto', () => {
    const col = new Collection();
    expect(col.mode).toBe('auto');
    expect(col.isActive).toBe(false);
  });

  test('auto', () => {
    const col = new Collection(undefined, { mode: Mode.Auto });
    expect(col.mode).toBe('auto');
    expect(col.isActive).toBe(false);
  });

  test('on', () => {
    const col = new Collection(undefined, { mode: Mode.On });
    expect(col.mode).toBe('on');
    expect(col.isActive).toBe(false);
  });

  test('off', () => {
    const col = new Collection(undefined, { mode: Mode.Off });
    expect(col.mode).toBe('off');
    expect(col.isActive).toBe(false);
  });

  test('bogus', () => {
    // @ts-expect-error Type '"bogus"' is not assignable to type 'Mode'.
    expect(() => new Collection(undefined, { mode: 'bogus' })).toThrow();
  });
});

describe('get/set', () => {
  test('on', () => {
    const col = new Collection();
    col.mode = Mode.On;
    expect(col.mode).toBe('on');
    expect(col.isActive).toBe(false);
  });
  test('off', () => {
    const col = new Collection();
    col.mode = Mode.Off;
    expect(col.mode).toBe('off');
    expect(col.isActive).toBe(false);
  });
  test('auto', () => {
    const col = new Collection(undefined, { mode: Mode.Off });
    col.mode = Mode.Auto;
    expect(col.mode).toBe('auto');
    expect(col.isActive).toBe(false);
  });
  test('bogus', () => {
    const col = new Collection();
    // @ts-expect-error Type '"bogus"' is not assignable to type 'Mode'.
    expect(() => (col.mode = 'bogus')).toThrow();
  });
  test('empty string', () => {
    const col = new Collection();
    // @ts-expect-error Type '""' is not assignable to type 'Mode'.
    expect(() => (col.mode = '')).toThrow();
  });
  test('undefined', () => {
    const col = new Collection();
    // @ts-ignore Type 'undefined' is not assignable to type 'Mode'.
    expect(() => (col.mode = undefined)).toThrow();
  });
});
