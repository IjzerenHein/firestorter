import type { CollectionReference, Query } from 'firebase/firestore';
import Collection from './Collection';
import { ICollection, DocumentSource, IDocumentOptions, CollectionSource, ICollectionDocument, IEnhancedObservableDelegate, IContext, IHasContext } from './Types';
export declare type AggregateCollectionOrderBy<T> = (a: T, b: T) => number;
export declare type AggregateCollectionFilterBy<T> = (doc: T) => boolean;
export interface IAggregateCollectionQuery {
    key: string;
    query: (ref: CollectionReference) => Query | null | undefined;
}
export declare type AggregateCollectionQueries<Y> = Y[] | null;
export declare type AggregateCollectionQueriesFn<Y extends IAggregateCollectionQuery> = () => AggregateCollectionQueries<Y>;
export interface IAggregateCollectionOptions<T, Y extends IAggregateCollectionQuery> {
    queries: AggregateCollectionQueriesFn<Y>;
    createDocument?: (source: DocumentSource, options: IDocumentOptions) => T;
    debug?: boolean;
    debugName?: string;
    orderBy?: AggregateCollectionOrderBy<T>;
    filterBy?: AggregateCollectionFilterBy<T>;
    context?: IContext;
}
/**
 * Collection that aggregates documents from multiple queries into
 * a single, easy accessible collection.
 *
 * AggregateCollection is driven by the `queries` function, which defines what
 * queries should be executed on the Firestore cloud back-end. GeoQuery is
 * for instance a more specific use-case of a aggregated-collection using a range
 * of geo-hash queries.
 *
 * @param {CollectionSource} [source] String-path, ref or function that returns a path or ref
 * @param {Object} [options] Configuration options
 * @param {AggregateCollectionQueriesFn} [options.queries] See `AggregateCollection.queries`
 * @param {Function} [options.createDocument] Factory function for creating documents `(source, options) => new Document(source, options)`
 * @param {Function} [options.orderBy] Client side sort function
 * @param {Function} [options.filterBy] Client side filter function
 * @param {boolean} [options.debug] Enables debug logging
 * @param {String} [options.debugName] Name to use when debug logging is enabled
 *
 * @example
 * import {AggregateCollection} from 'firestorter';
 *
 * // Query all unfinished todos for a set of users
 * const userIds = ['pinky', 'brain'];
 * const col = new AggregateCollection('todos', {
 *   queries: () => userIds.map(userId => ({
 *     key: userId, // unique-key by which the query is re-used/cached
 *     query: (ref) => ref.where('userId', '==', userId).where('finished', '==', false)
 *   }))
 * });
 */
declare class AggregateCollection<T extends ICollectionDocument, Y extends IAggregateCollectionQuery = IAggregateCollectionQuery> implements ICollection<T>, IEnhancedObservableDelegate, IHasContext {
    private queriesFn;
    private collectionSource;
    private createDocument;
    private orderBy?;
    private filterBy?;
    private debug;
    private debugInstanceName?;
    private observedRefCount;
    private disposer?;
    private collections;
    private prevCollections;
    private collectionRecycleMap;
    private documentRecycleMap;
    private ctx?;
    constructor(source: CollectionSource, options: IAggregateCollectionOptions<T, Y>);
    /**
     * Array of all the documents that have been fetched
     * from firestore.
     *
     * @type {Array}
     *
     * @example
     * aggregateCollection.docs.forEach((doc) => {
     *   console.log(doc.data);
     * });
     */
    get docs(): T[];
    /**
     * True whenever any documents have been fetched.
     *
     * @type {boolean}
     */
    get hasDocs(): boolean;
    /**
     * Array of all the collections inside this aggregate
     * collection.
     *
     * @type {Array}
     *
     * @example
     * aggregateCollection.cols.forEach((col) => {
     *   console.log(col.docs.length);
     * });
     */
    get cols(): Collection<T>[];
    /**
     * Queries function.
     *
     * @type {Function}
     */
    get queries(): AggregateCollectionQueriesFn<Y>;
    /**
     * True when new data is being loaded.
     *
     * @type {boolean}
     */
    get isLoading(): boolean;
    /**
     * True when data for all underlying collections has been loaded.
     *
     * @type {boolean}
     */
    get isLoaded(): boolean;
    /**
     * @private
     */
    get debugName(): string;
    toString(): string;
    /**
     * @private
     */
    get context(): IContext | undefined;
    /**
     * Called whenever a property of this class becomes observed.
     * @private
     */
    addObserverRef(): number;
    /**
     * Called whenever a property of this class becomes un-observed.
     * @private
     */
    releaseObserverRef(): number;
    /**
     * @private
     */
    private _onCreateDocument;
    /**
     * @private
     */
    private _updateQueries;
}
export default AggregateCollection;
