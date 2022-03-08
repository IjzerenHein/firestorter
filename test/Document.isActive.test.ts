import { autorun } from 'mobx';

import { Document, Mode } from '../src';

describe('off', () => {
  test('construct no ref', () => {
    const doc = new Document(undefined, { mode: Mode.Off });
    expect(doc.isActive).toBe(false);
  });

  test('construct with ref', () => {
    const doc = new Document('todos/todo', { mode: Mode.Off });
    expect(doc.isActive).toBe(false);
  });

  test('no ref, observed', () => {
    const doc = new Document('todos/todo', { mode: Mode.Off });
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
    const doc = new Document(undefined, { mode: Mode.On });
    expect(doc.isActive).toBe(false);
  });

  test('construct with ref', () => {
    const doc = new Document('todos/todo', { mode: Mode.On });
    expect(doc.isActive).toBe(true);
    doc.ref = undefined;
    expect(doc.isActive).toBe(false);
  });

  test('reset ref', () => {
    const doc = new Document('todos/todo', { mode: Mode.On });
    doc.path = undefined;
    expect(doc.isActive).toBe(false);
  });

  test('set', () => {
    const doc = new Document('todos/todo');
    doc.mode = Mode.On;
    expect(doc.isActive).toBe(true);
    doc.mode = Mode.Off;
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
    // @ts-ignore
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
    doc.mode = Mode.Off;
    expect(doc.isActive).toBe(false);
    doc.mode = Mode.Auto;
    expect(doc.isActive).toBe(true);
    dispose();
    expect(doc.isActive).toBe(false);
  });
});
