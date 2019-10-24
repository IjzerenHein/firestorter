// @flow
import { app, firestore } from 'firebase';
import * as firebase from 'firebase';

///////////////////////////////
// Types.ts
///////////////////////////////

export type IContext = {|
	+firebase: typeof firebase,
	+app: app.App,
	+firestore: firestore.Firestore
|};

export interface IHasContext {
	+context?: IContext;
}

export type DocumentSource =
	| firestore.DocumentReference
	| string
	| (() => firestore.DocumentReference | string | void)
	| void;

export type IDocumentOptions = {|
	schema?: any,
	snapshot?: firestore.DocumentSnapshot,
	snapshotOptions?: firestore.SnapshotOptions,
	mode?: Mode,
	debug?: boolean,
	debugName?: string,
	context?: IContext
|};

export interface IDocument {
	+id: ?string;
}

export type CollectionSource =
	| firestore.CollectionReference
	| string
	| (() => firestore.CollectionReference | string | void);

export type CollectionQuery = (
	ref: firestore.CollectionReference
) => ?firestore.Query;

export type ICollectionOptions<T> = {|
	query?: CollectionQuery,
	createDocument?: (source: DocumentSource, options: IDocumentOptions) => T,
	DocumentClass?: any, // deprecated, use `createDocument` instead
	mode?: Mode,
	debug?: boolean,
	debugName?: string,
	minimizeUpdates?: boolean,
	initialLocalSnapshotDetectTime?: number,
	initialLocalSnapshotDebounceTime?: number,
	context?: IContext
|};

export interface ICollectionDocument extends IDocument {
	addCollectionRef(): number;
	releaseCollectionRef(): number;
	updateFromCollectionSnapshot(snapshot: firestore.DocumentSnapshot): void;
}

export type Mode = 'auto' | 'on' | 'off';

export interface IEnhancedObservableDelegate {
	addObserverRef(): number;
	releaseObserverRef(): number;
}

///////////////////////////////
// Init.ts
///////////////////////////////

declare export function initFirestorter(config: {
	firebase: typeof firebase,
	app?: string | app.App,
	firestore?: firestore.Firestore
}): void;
declare export function makeContext(config: {
	firebase: typeof firebase,
	app?: string | app.App,
	firestore?: firestore.Firestore
}): IContext;
declare export function getFirebase(obj?: IHasContext): typeof firebase;
declare export function getFirebaseApp(obj?: IHasContext): app.App;
declare export function getFirestore(obj?: IHasContext): firestore.Firestore;

///////////////////////////////
// Document.ts
///////////////////////////////

declare export class Document<T: Object = Object>
	implements ICollectionDocument, IEnhancedObservableDelegate, IHasContext {
	constructor(source?: DocumentSource, options?: IDocumentOptions): void;
	+schema: (data: any) => any;
	+data: T;
	+hasData: boolean;
	ref: ?firestore.DocumentReference;
	+id: ?string;
	path: string | (() => ?string) | void;
	source: DocumentSource;
	mode: Mode;
	+isActive: boolean;
	+snapshot: ?firestore.DocumentSnapshot;
	update(fields: Object): Promise<void>;
	set(data: any, options?: any): Promise<void>;
	delete(): Promise<void>;
	fetch(): Promise<Document<T>>;
	+isLoading: boolean;
	ready(): Promise<void>;
	toString(): string;
	+debugName: string;
	// IHasContext
	+context: IContext;
	// IEnhancedObservableDelegate
	addObserverRef(): number;
	releaseObserverRef(): number;
	// ICollectionDocument
	addCollectionRef(): number;
	releaseCollectionRef(): number;
	updateFromCollectionSnapshot(snapshot: firestore.DocumentSnapshot): void;
}

///////////////////////////////
// Collection.ts
///////////////////////////////

declare export class Collection<T: ICollectionDocument = Document<Object>>
	implements IEnhancedObservableDelegate, IHasContext {
	constructor(source?: CollectionSource, options?: ICollectionOptions<T>): void;
	+docs: T[];
	+hasDocs: boolean;
	ref: ?firestore.CollectionReference;
	+id: ?string;
	path: ?string;
	source: CollectionSource;
	query: ?CollectionQuery;
	+queryRef: firestore.Query | void;
	mode: Mode;
	+isActive: boolean;
	fetch(): Promise<Collection<T>>;
	+isLoading: boolean;
	ready(): Promise<void>;
	add(data: any): Promise<T>;
	deleteAll(): Promise<void>;
	toString(): string;
	+debugName: string;
	// IHasContext
	+context: IContext;
	// IEnhancedObservableDelegate
	addObserverRef(): number;
	releaseObserverRef(): number;
}

///////////////////////////////
// Utils.ts
///////////////////////////////

declare export function mergeUpdateData(
	data: Object,
	fields: Object,
	hasContext?: IHasContext
): Object;
declare export function verifyMode(mode: Mode): Mode;
declare export function isTimestamp(val: any): boolean;
