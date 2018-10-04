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

interface ICollectionDocumentConstructor {
	new (source: DocumentSource, options: IDocumentOptions): ICollectionDocument;
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
	ICollectionDocumentConstructor,
	IDocument,
	IDocumentOptions,
	IEnhancedObservableDelegate,
	CollectionQuery,
	CollectionSource,
	DocumentSource,
	Mode
};
