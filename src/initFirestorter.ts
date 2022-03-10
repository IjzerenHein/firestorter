import type { IContext, IHasContext} from './Types';
  
  let globalContext: IContext;
  
  /**
   * Initializes `firestorter` with the firebase-app.
   *
   * @param {Object} config - Configuration options
   * @param {FirebaseApp} config.app - Firebase App instance
   * @param {Firestore} config.firestore - Firestore instance
   *
   * @example
   * import { initializeApp } from 'firebase/app';
   * import { getFirestore, FieldValue } from 'firebase/firestore';
   * import { initFirestorter, Collection, Document } from 'firestorter';
   *
   * // Initialize firebase app
   * const app = initializeApp({...});
   * const firestore = getFirestore(app);
   *
   * // Initialize `firestorter`
   * initFirestorter({ app, firestore, FieldValue });
   *
   * // Create collection or document
   * const albums = new Collection('artists/Metallica/albums');
   * ...
   * const album = new Document('artists/Metallica/albums/BlackAlbum');
   * ...
   */
  export function initFirestorter(context: IContext) {
    if (globalContext) {
      throw new Error(
        'Firestorter already initialized, did you accidentally call `initFirestorter()` again?'
      );
    }
    globalContext = context;
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
  