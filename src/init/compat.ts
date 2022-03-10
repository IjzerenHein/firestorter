import type Firebase from 'firebase/compat/app';

import type { IContext } from '../Types';

export type FirestorterCompatConfig = {
  firebase: typeof Firebase;
  app?: string | Firebase.app.App;
  firestore?: Firebase.firestore.Firestore;
};

/**
 * Creates a firestorter compat context.
 *
 * @param {Object} config - Configuration options
 * @param {Firebase} config.firebase - Firebase instance
 * @param {FirebaseApp | string} [config.app] - Firebase app instance or name
 * @param {Firestore} [config.firestore] - Firestore instance
 *
 * @example
 * import firebase from 'firebase/compat/app';
 * import 'firebase/compat/firestore';
 * import { Collection, Document, makeCompatContext } from 'firestorter'
 *
 * // Initialize firebase app
 * firebase.initializeApp({...});
 *
 * // Initialize global `firestorter` context
 * initFirestorter(makeCompatContext({ firebase: firebase }));
 *
 * // Create collection or document
 * const albums = new Collection('artists/Metallica/albums');
 * ...
 * const album = new Document('artists/Metallica/albums/BlackAlbum');
 * ...
 *
 * // Or create a custom context to connect to another Firebase app
 * const app2 = firebase.initializeApp({...});
 * const app2Context = makeCompatContext({ firebase: firebase, app: app2 });
 *
 * // Create collection or document
 * const albums2 = new Collection('artists/Metallica/albums', {context: app2Context});
 * ...
 * const album2 = new Document('artists/Metallica/albums/BlackAlbum', {context: app2Context});
 * ...
 */
export function makeCompatContext(config: FirestorterCompatConfig): IContext {
  const { firebase } = config;

  // Get app instance
  const app = config.app
    ? typeof config.app === 'string'
      ? firebase.app(config.app)
      : config.app
    : firebase.app();

  // Get firestore instance
  const firestore = config.firestore ?? app.firestore();
  if (!firestore) {
    throw new Error(
      "firebase.firestore() returned `undefined`, did you forget `import 'firebase/firestore';` ?"
    );
  }

  return {
    // @ts-ignore
    collection: (path: string) => firestore.collection(path),
    // @ts-ignore
    doc: (path: string) => firestore.doc(path),
    // @ts-ignore
    getDocs: (ref) => ref.get(),
    // @ts-ignore
    where: (fieldPath, opStr, value) => [fieldPath, opStr, value],
    // @ts-ignore
    query: (ref, where1, where2, where3) => {
      // @ts-ignore
      ref = where1 ? ref.where(where1[0], where1[1], where1[2]) : ref;
      // @ts-ignore
      ref = where2 ? ref.where(where2[0], where2[1], where2[2]) : ref;
      // @ts-ignore
      ref = where3 ? ref.where(where3[0], where3[1], where3[2]) : ref;
      return ref;
    },
    // @ts-ignore
    addDoc: (ref, data) => ref.add(data),
    // @ts-ignore
    getDoc: (ref) => ref.get(),
    // @ts-ignore
    setDoc: (ref, data, options) => ref.set(data, options),
    // @ts-ignore
    updateDoc: (ref, fields) => ref.update(fields),
    // @ts-ignore
    deleteDoc: (ref) => ref.delete(),
    // @ts-ignore
    onSnapshot: (ref, resultFn, errorFn) => ref.onSnapshot(resultFn, errorFn),
    // @ts-ignore
    deleteField: () => firebase.firestore.FieldValue.delete(),
  // @ts-ignore
    serverTimestamp: () => firebase.firestore.FieldValue.serverTimestamp(),
  };
}
