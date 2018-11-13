import {
	CollectionReference,
	DocumentReference,
	DocumentSnapshot,
	Query
} from "firebase/firestore";

/**
 * Document Source.
 */
type DocumentSource =
	| DocumentReference
	| string
	| (() => DocumentReference | string | undefined)
	| undefined;

/**
 * Document options.
 */
interface IDocumentOptions {
	schema?: any;
	snapshot?: DocumentSnapshot;
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
	| CollectionReference
	| string
	| (() => CollectionReference | string | undefined);

/**
 * Collection options.
 */
interface ICollectionOptions<T> {
	query?: Query | (() => Query | undefined);
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
type CollectionQuery = ((CollectionReference) => Query) | Query | undefined;

/**
 * Collection document.
 */
interface ICollectionDocument extends IDocument {
	addCollectionRef(): number;
	releaseCollectionRef(): number;
	updateFromCollectionSnapshot(snapshot: DocumentSnapshot): void;
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
