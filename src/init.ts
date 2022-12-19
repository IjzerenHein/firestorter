import type { IContext, IHasContext } from './Types';
import { makeCompatContext, FirestorterCompatConfig } from './compat';

let globalContext: IContext;

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
export function initFirestorter(context: IContext | FirestorterCompatConfig) {
  if (globalContext) {
    throw new Error(
      'Firestorter already initialized, did you accidentally call `initFirestorter()` again?'
    );
  }
  // @ts-expect-error Property 'collection' does not exist on type 'IContext | FirestorterCompatConfig'.
  if (context.collection) {
    globalContext = context as IContext;
  } else {
    globalContext = makeCompatContext(context as FirestorterCompatConfig);
  }
  return globalContext;
}

export function getContext(obj?: IHasContext): IContext {
  if (obj?.context) {
    return obj.context;
  }

  if (globalContext) {
    return globalContext;
  }

  if (obj) {
    throw new Error(
      `No context for ${obj} or globally. Did you forget to call \`initFirestorter\` or pass {context: ...} option?`
    );
  }

  throw new Error(`No global Firestore context. Did you forget to call \`initFirestorter\` ?`);
}
