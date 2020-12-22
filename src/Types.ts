import type Firebase from 'firebase';

import { IContext } from './init';

/**
 * Document Source.
 */
export type DocumentSource =
  | Firebase.firestore.DocumentReference
  | string
  | (() => Firebase.firestore.DocumentReference | string | undefined)
  | undefined;

/**
 * Document options.
 */
export interface IDocumentOptions {
  schema?: any;
  snapshot?: Firebase.firestore.DocumentSnapshot;
  snapshotOptions?: Firebase.firestore.SnapshotOptions;
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
  | Firebase.firestore.CollectionReference
  | string
  | (() => Firebase.firestore.CollectionReference | string | undefined);

/**
 * Collection-query.
 */
export type CollectionQuery =
  | ((ref: Firebase.firestore.CollectionReference) => Firebase.firestore.Query | null | undefined)
  | Firebase.firestore.Query;

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
  updateFromCollectionSnapshot(snapshot: Firebase.firestore.DocumentSnapshot): void;
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
