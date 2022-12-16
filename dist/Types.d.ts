import type { DocumentReference, DocumentSnapshot, SnapshotOptions, CollectionReference, Query } from 'firebase/firestore';
import type { IContext } from './IContext';
export { IContext };
export interface IHasContext {
    readonly context?: IContext;
}
/**
 * Document Source.
 */
export declare type DocumentSource = DocumentReference | string | (() => DocumentReference | string | undefined) | undefined;
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
export declare type CollectionSource = CollectionReference | string | (() => CollectionReference | string | undefined);
/**
 * Collection-query.
 */
export declare type CollectionQuery = ((ref: CollectionReference) => Query | null | undefined) | Query;
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
export declare enum Mode {
    Auto = "auto",
    On = "on",
    Off = "off"
}
/**
 * @private
 */
export interface IEnhancedObservableDelegate {
    addObserverRef(): number;
    releaseObserverRef(): number;
}
