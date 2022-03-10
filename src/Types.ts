import type {
  DocumentReference,
  DocumentSnapshot,
  SnapshotOptions,
  CollectionReference,
  Query,
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

export interface IContext {
  collection(path: string): ReturnType<typeof collection>;
  doc(path: string): ReturnType<typeof doc>;
  readonly getDocs: typeof getDocs;
  readonly where: typeof where;
  readonly query: typeof query;
  readonly addDoc: typeof addDoc;
  readonly getDoc: typeof getDoc;
  readonly setDoc: typeof setDoc;
  readonly updateDoc: typeof updateDoc;
  readonly deleteDoc: typeof deleteDoc;
  readonly onSnapshot: typeof onSnapshot;
  readonly deleteField: typeof deleteField;
  readonly serverTimestamp: typeof serverTimestamp;
}

export interface IHasContext {
  readonly context?: IContext;
}

/**
 * Document Source.
 */
export type DocumentSource =
  | DocumentReference
  | string
  | (() => DocumentReference | string | undefined)
  | undefined;

/**
 * Document options.
 */
export interface IDocumentOptions {
  schema?: any;
  snapshot?: DocumentSnapshot;
  snapshotOptions?: SnapshotOptions;
  mode?: Mode;
  debug?: boolean;
  debugName?: string;
  context?: IContext;
}

/**
 * Document interface.
 */
export interface IDocument {
  readonly id: string | undefined;
}

/**
 * Collection interface.
 */
export interface ICollection<T> {
  readonly docs: T[];
  readonly hasDocs: boolean;
}

/**
 * Collection-source.
 */
export type CollectionSource =
  | CollectionReference
  | string
  | (() => CollectionReference | string | undefined);

/**
 * Collection-query.
 */
export type CollectionQuery = ((ref: CollectionReference) => Query | null | undefined) | Query;

/**
 * Collection options.
 */
export interface ICollectionOptions<T> {
  query?: CollectionQuery;
  createDocument?: (source: DocumentSource, options: IDocumentOptions) => T;
  mode?: Mode;
  debug?: boolean;
  debugName?: string;
  minimizeUpdates?: boolean;
  initialLocalSnapshotDetectTime?: number;
  initialLocalSnapshotDebounceTime?: number;
  context?: IContext;
}

/**
 * Collection document.
 */
export interface ICollectionDocument extends IDocument {
  addCollectionRef(): number;
  releaseCollectionRef(): number;
  updateFromCollectionSnapshot(snapshot: DocumentSnapshot): void;
}

/**
 * Real-time updating mode.
 * @type Mode
 */
export enum Mode {
  Auto = 'auto',
  On = 'on',
  Off = 'off',
}

/**
 * @private
 */
export interface IEnhancedObservableDelegate {
  addObserverRef(): number;
  releaseObserverRef(): number;
}
