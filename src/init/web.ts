import type { Firestore } from 'firebase/firestore';
import {
  collection,
  doc,
  getDocs,
  where,
  query,
  addDoc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  deleteField,
  serverTimestamp,
} from 'firebase/firestore';

import type { IContext } from '../Types';

export type FirestorterWebConfig = {
  firestore: Firestore;
};

/**
 * Creates a firestorter web context.
 *
 * @param {Object} config - Configuration options
 * @param {Firestore} config.firestore - Firestore instance
 *
 * @example
 * import { initializeApp } from 'firebase/app';
 * import { getFirestore } from 'firebase/firestore';
 * import { Collection, Document, makeWebContext } from 'firestorter'
 *
 * // Initialize firebase app
 * const app = initializeApp({...});
 * const firestore = getFirestore(app);
 *
 * // Initialize global `firestorter` context
 * initFirestorter(makeWebContext({ firestore }));
 *
 * // Create collection or document
 * const albums = new Collection('artists/Metallica/albums');
 * ...
 * const album = new Document('artists/Metallica/albums/BlackAlbum');
 * ...
 *
 * // Or create a custom context to connect to another Firebase app
 * const app2 = initializeApp({...});
 * const firestore2 = getFirestore(app2);
 * const app2Context = makeWebContext({ firestore: firestore2 });
 *
 * // Create collection or document
 * const albums2 = new Collection('artists/Metallica/albums', {context: app2Context});
 * ...
 * const album2 = new Document('artists/Metallica/albums/BlackAlbum', {context: app2Context});
 * ...
 */
export function makeWebContext(config: FirestorterWebConfig): IContext {
  const { firestore } = config;
  if (!firestore) throw new Error('Missing argument `firestore`');
  return {
    collection: (path: string) => collection(firestore, path),
    doc: (path: string) => doc(firestore, path),
    getDocs,
    where,
    query,
    addDoc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    deleteField,
    serverTimestamp,
  };
}
