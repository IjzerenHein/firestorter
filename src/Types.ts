import { firestore } from "firebase";

/**
 * Document Source.
 */
export type DocumentSource =
	| firestore.DocumentReference
	| string
	| (() => firestore.DocumentReference | string | undefined)
	| undefined;

/**
 * Document options.
 */
export interface IDocumentOptions {
	schema?: any;
	snapshot?: firestore.DocumentSnapshot;
	mode?: Mode;
	debug?: boolean;
	debugName?: string;
}

/**
 * Document interface.
 */
export interface IDocument {
	readonly id: string | undefined;
}

/**
 * Collection-source.
 */
export type CollectionSource =
	| firestore.CollectionReference
	| string
	| (() => firestore.CollectionReference | string | undefined);

/**
 * Collection options.
 */
export interface ICollectionOptions<T> {
	query?: firestore.Query | (() => firestore.Query | undefined);
	createDocument?: (source: DocumentSource, options: IDocumentOptions) => T;
	DocumentClass?: any; // deprecated, use `createDocument` instead
	mode?: Mode;
	debug?: boolean;
	debugName?: string;
	minimizeUpdates?: boolean;
	initialLocalSnapshotDetectTime?: number;
	initialLocalSnapshotDebounceTime?: number;
}

/**
 * Collection-query.
 */
export type CollectionQuery =
	| ((ref: firestore.CollectionReference) => firestore.Query)
	| firestore.Query
	| undefined;

/**
 * Collection document.
 */
export interface ICollectionDocument extends IDocument {
	addCollectionRef(): number;
	releaseCollectionRef(): number;
	updateFromCollectionSnapshot(snapshot: firestore.DocumentSnapshot): void;
}

/**
 * Real-time updating mode.
 */
export enum Mode {
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
