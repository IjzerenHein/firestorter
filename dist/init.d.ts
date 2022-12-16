import type { IContext, IHasContext } from './Types';
import { FirestorterCompatConfig } from './compat';
/**
 * Initializes `firestorter` with the firebase-app.
 *
 * @param {IContext | FirestorterCompatConfig} config - Configuration options
 *
 * @example
 * import { initializeApp } from 'firebase/app';
 * import { getFirestore } from 'firebase/firestore';
 * import { initFirestorter, Collection, Document } from 'firestorter';
 *
 * // Initialize firebase app
 * const app = initializeApp({...});
 * const firestore = getFirestore(app);
 *
 * // Initialize `firestorter`
 * initFirestorter({ app, firestore });
 *
 * // Create collection or document
 * const albums = new Collection('artists/Metallica/albums');
 * ...
 * const album = new Document('artists/Metallica/albums/BlackAlbum');
 * ...
 */
export declare function initFirestorter(context: IContext | FirestorterCompatConfig): IContext;
export declare function getContext(obj?: IHasContext): IContext;
