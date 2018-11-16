import { firestore } from "firebase";

/**
 * Document Source.
 */
type DocumentSource =
	| firestore.DocumentReference
	| string
	| (() => firestore.DocumentReference | string | undefined)
	| undefined;

/**
 * Document options.
 */
interface IDocumentOptions {
	schema?: any;
	snapshot?: firestore.DocumentSnapshot;
	mode?: Mode;
	debug?: boolean;
	debugName?: string;
}

/**
 * Document interface.
 */
interface IDocument {
	readonly id: string | undefined;
}

/**
 * Collection-source.
 */
type CollectionSource =
	| firestore.CollectionReference
	| string
	| (() => firestore.CollectionReference | string | undefined);

/**
 * Collection options.
 */
interface ICollectionOptions<T> {
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
type CollectionQuery =
	| ((ref: firestore.CollectionReference) => firestore.Query)
	| firestore.Query
	| undefined;

/**
 * Collection document.
 */
interface ICollectionDocument extends IDocument {
	addCollectionRef(): number;
	releaseCollectionRef(): number;
	updateFromCollectionSnapshot(snapshot: firestore.DocumentSnapshot): void;
}

/**
 * Real-time updating mode.
 */
enum Mode {
	Auto = "auto",
	On = "on",
	Off = "off"
}

/**
 * @private
 */
interface IEnhancedObservableDelegate {
	addObserverRef(): number;
	releaseObserverRef(): number;
}

export {
	ICollectionDocument,
	ICollectionOptions,
	IDocument,
	IDocumentOptions,
	IEnhancedObservableDelegate,
	CollectionQuery,
	CollectionSource,
	DocumentSource,
	Mode
};
