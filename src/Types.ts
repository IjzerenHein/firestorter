import { firestore } from "firebase";
import { IContext } from "./init"

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
	snapshotOptions?: firestore.SnapshotOptions;
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
 * Collection-source.
 */
export type CollectionSource =
	| firestore.CollectionReference
	| string
	| (() => firestore.CollectionReference | string | undefined);

/**
 * Collection-query.
 */
export type CollectionQuery =
	| ((ref: firestore.CollectionReference) => firestore.Query | null | undefined)
	| firestore.Query;

/**
 * Collection options.
 */
export interface ICollectionOptions<T> {
	query?: CollectionQuery;
	createDocument?: (source: DocumentSource, options: IDocumentOptions) => T;
	DocumentClass?: any; // deprecated, use `createDocument` instead
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
	updateFromCollectionSnapshot(snapshot: firestore.DocumentSnapshot): void;
}

/**
 * Real-time updating mode.
 * @type Mode
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
