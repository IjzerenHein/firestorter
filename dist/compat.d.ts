import type Firebase from 'firebase/compat/app';
import type { IContext } from './IContext';
export declare type FirestorterCompatConfig = {
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
export declare function makeCompatContext(config: FirestorterCompatConfig): IContext;
