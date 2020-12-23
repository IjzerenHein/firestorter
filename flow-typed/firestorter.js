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

export type FirestorterConfig = {
	firebase: typeof firebase;
	app?: string | app.App;
	firestore?: firestore.Firestore;
};

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
declare export function makeFirestorterContext(config: {
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
	+isLoaded: boolean;
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
	+isLoaded: boolean;
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
// AggregateCollection.ts
///////////////////////////////

export type AggregateCollectionOrderBy<T> = (a: T, b: T) => number;
export type AggregateCollectionFilterBy<T> = (doc: T) => boolean;
export interface IAggregateCollectionQuery {
	key: string;
	query: (ref: firestore.CollectionReference) => firestore.Query | void;
}
export type AggregateCollectionQueries<Y> = Y[] | null;
export type AggregateCollectionQueriesFn<
	Y: IAggregateCollectionQuery
> = () => AggregateCollectionQueries<Y>;

export interface IAggregateCollectionOptions<T, Y: IAggregateCollectionQuery> {
	createDocument?: (source: DocumentSource, options: IDocumentOptions) => T;
	queries: AggregateCollectionQueriesFn<Y>;
	debug?: boolean;
	debugName?: string;
	orderBy?: AggregateCollectionOrderBy<T>;
	filterBy?: AggregateCollectionFilterBy<T>;
}

declare export class AggregateCollection<
	T: ICollectionDocument,
	Y: IAggregateCollectionQuery = IAggregateCollectionQuery
> implements IEnhancedObservableDelegate, IHasContext {
	constructor(
		source?: CollectionSource,
		options?: IAggregateCollectionOptions<T, Y>
	): void;
	+docs: T[];
	+hasDocs: boolean;
	+cols: Array<Collection<Y>>;
	queries(): AggregateCollectionQueriesFn<Y>;
	+isLoading: boolean;
	+isLoaded: boolean;
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

///////////////////////////////
// GeoHash.ts
///////////////////////////////

export interface IGeoPoint {
	+latitude: number;
	+longitude: number;
}

export interface IGeoRegion extends IGeoPoint {
	+latitudeDelta: number;
	+longitudeDelta: number;
}

declare export function encodeGeohash(
	location: IGeoPoint,
	precision?: number
): string;
declare export function decodeGeohash(geohash: string): IGeoPoint[];
declare export function getGeohashesForRadius(
	center: IGeoPoint,
	radius: number
): string[][];
declare export function getGeohashesForRegion(region: IGeoRegion): string[][];
declare export function flattenGeohashRange(
	geohash1: string,
	geohash2: string
): string[];
declare export function flattenGeohashes(geohashes: string[][]): string[];
declare export function calculateGeoDistance(
	location1: IGeoPoint,
	location2: IGeoPoint
): number;
declare export function insideGeoRegion(
	point: IGeoPoint,
	region: IGeoRegion
): boolean;
declare export function geoRegionToPoints(
	region: IGeoRegion
): {
	northEast: IGeoPoint,
	northWest: IGeoPoint,
	southEast: IGeoPoint,
	southWest: IGeoPoint
};
declare export function metersToLongitudeDegrees(
	distance: number,
	latitude: number
): number;
declare export function metersToLatitudeDegrees(distance: number): number;

///////////////////////////////
// GeoQuery.ts
///////////////////////////////

export type GeoQueryRegion = IGeoRegion | (() => IGeoRegion | void);
export type GeoQueryHash = string[];

export interface IGeoQueryQuery extends IAggregateCollectionQuery {
	geoHash: GeoQueryHash;
}

export type IGeoQueryOptions<T> = $Diff<
	IAggregateCollectionOptions<T, IGeoQueryQuery>,
	{|
		queries: AggregateCollectionQueriesFn<IGeoQueryQuery>,
		filterBy?: AggregateCollectionFilterBy<T>
	|}
> & {|
	region?: GeoQueryRegion,
	fieldPath?: string,
	filterBy?: (doc: T, region?: IGeoRegion | void) => boolean
|};

declare export class GeoQuery<
	T: ICollectionDocument
> extends AggregateCollection<T, IGeoQueryQuery> {
	constructor(source: CollectionSource, options: IGeoQueryOptions<T>): void;
	region: ?GeoQueryRegion;
	+geohashes: GeoQueryHash[];
}
