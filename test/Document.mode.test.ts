import { Document, Mode } from '../src';

describe('construct', () => {
  test('default is auto', () => {
    const doc = new Document();
    expect(doc.mode).toBe('auto');
    expect(doc.isActive).toBe(false);
  });

  test('auto', () => {
    const doc = new Document(undefined, { mode: Mode.Auto });
    expect(doc.mode).toBe('auto');
    expect(doc.isActive).toBe(false);
  });

  test('on', () => {
    const doc = new Document(undefined, { mode: Mode.On });
    expect(doc.mode).toBe('on');
    expect(doc.isActive).toBe(false);
  });

  test('off', () => {
    const doc = new Document(undefined, { mode: Mode.Off });
    expect(doc.mode).toBe('off');
    expect(doc.isActive).toBe(false);
  });

  test('bogus', () => {
    // @ts-expect-error
    expect(() => new Document(undefined, { mode: 'bogus' })).toThrow();
  });
});

describe('get/set', () => {
  test('on', () => {
    const doc = new Document();
    doc.mode = Mode.On;
    expect(doc.mode).toBe('on');
    expect(doc.isActive).toBe(false);
  });
  test('off', () => {
    const doc = new Document();
    doc.mode = Mode.Off;
    expect(doc.mode).toBe('off');
    expect(doc.isActive).toBe(false);
  });
  test('auto', () => {
    const doc = new Document(undefined, { mode: Mode.Off });
    doc.mode = Mode.Auto;
    expect(doc.mode).toBe('auto');
    expect(doc.isActive).toBe(false);
  });
  test('bogus', () => {
    const doc = new Document();
    // @ts-expect-error
    expect(() => (doc.mode = 'bogus')).toThrow();
  });
  test('empty string', () => {
    const doc = new Document();
    // @ts-expect-error
    expect(() => (doc.mode = '')).toThrow();
  });
  test('undefined', () => {
    const doc = new Document();
    expect(() => (doc.mode = undefined)).toThrow();
  });
});
