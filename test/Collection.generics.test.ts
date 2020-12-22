/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import type Firebase from 'firebase';

import { ICollectionDocument } from '../src/Types';
import { Collection, Document } from './init';

class TestDoc implements ICollectionDocument {
  private collectionRef: number = 0;

  constructor(_source, _options) {
    this.collectionRef = 0;
  }

  get id(): string | undefined {
    return '0';
  }

  public addCollectionRef(): number {
    this.collectionRef++;
    return this.collectionRef;
  }

  public releaseCollectionRef(): number {
    this.collectionRef--;
    return this.collectionRef;
  }

  public updateFromCollectionSnapshot(_snapshot: Firebase.firestore.DocumentSnapshot): void {
    // nop
  }
}

test('no generic type specified', () => {
  const col = new Collection();
  if (col.docs.length) {
    const doc: Document = col.docs[0];
    doc.id;
  }
});

test('default generic type specified', () => {
  const col = new Collection<Document>();
  if (col.docs.length) {
    const doc: Document = col.docs[0];
    doc.id;
  }
});

test('custom document type specified', () => {
  const col = new Collection<TestDoc>(undefined, {
    createDocument: (source, options) => new TestDoc(source, options),
  });
  if (col.docs.length) {
    const doc: TestDoc = col.docs[0];
    doc.id;
  }
});

test('.docs has correct generic type', () => {
  const col = new Collection<TestDoc>(undefined, {
    createDocument: (source, options) => new TestDoc(source, options),
  });
  if (col.docs.length) {
    const doc: TestDoc = col.docs[0];
    doc.id;
  }
});

test('.add has correct generic type', () => {
  const col = new Collection<TestDoc>(undefined, {
    createDocument: (source, options) => new TestDoc(source, options),
  });
  if (col.docs.length) {
    const promise: Promise<TestDoc> = col.add({
      whoop: true,
    });
    promise.then((doc) => doc.id);
  }
});

test('.fetch has correct generic type', () => {
  const col = new Collection<TestDoc>(undefined, {
    createDocument: (source, options) => new TestDoc(source, options),
  });
  if (col.docs.length) {
    const promise: Promise<Collection<TestDoc>> = col.fetch();
    promise.then((col2) => col2.path);
  }
});
