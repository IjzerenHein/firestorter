import type { Query, CollectionReference, QuerySnapshot } from 'firebase/firestore';
import Document from './Document';
import { CollectionQuery, CollectionSource, ICollectionDocument, ICollectionOptions, ICollection, IEnhancedObservableDelegate, Mode, IContext, IHasContext } from './Types';
/**
 * The Collection class lays at the heart of `firestorter`.
 * It represents a collection in Firestore and its queried data. It is
 * observable so that it can be efficiently linked to a React Component
 * using `mobx-react`'s `observer` pattern.
 *
 * Collection supports three modes of real-time updating:
 * - "auto" (real-time updating is enabled on demand) (default)
 * - "on" (real-time updating is permanently turned on)
 * - "off" (real-time updating is turned off, use `.fetch` explicitly)
 *
 * The "auto" mode ensures that Collection only communicates with
 * the firestore back-end whever the Collection is actually
 * rendered by a Component. This prevents unneccesary background
 * updates and leads to the best possible performance.
 *
 * When real-time updates are enabled, data is automatically fetched
 * from Firestore whenever it changes in the back-end (using `onSnapshot`).
 * This enables almost magical instant updates. When data is changed,
 * only those documents are updated that have actually changed. Document
 * objects are re-used where possible, and just their data is updated.
 * The same is true for the `docs` property. If no documents where
 * added, removed, re-ordered, then the `docs` property itself will not
 * change.
 *
 * Alternatively, you can keep real-time updates turned off and fetch
 * manually. This will update the Collection as efficiently as possible.
 * If nothing has changed on the back-end, no new Documents would be
 * created or modified.
 *
 * @param {CollectionSource} [source] String-path, ref or function that returns a path or ref
 * @param {Object} [options] Configuration options
 * @param {Function|Query} [options.query] See `Collection.query`
 * @param {String} [options.mode] See `Collection.mode`
 * @param {Function} [options.createDocument] Factory function for creating documents `(source, options) => new Document(source, options)`
 * @param {boolean} [options.minimizeUpdates] Enables additional algorithms to reduces updates to your app (e.g. when snapshots are received in rapid succession)
 * @param {boolean} [options.debug] Enables debug logging
 * @param {String} [options.debugName] Name to use when debug logging is enabled
 *
 * @example
 * import {Collection} from 'firestorter';
 *
 * // Create a collection using path (preferred)
 * const col = new Collection('artists/Metallica/albums');
 *
 * // Create a collection using a reference
 * const col2 = new Collection(firebase.firestore().collection('todos'));
 *
 * // Create a collection and permanently start real-time updating
 * const col2 = new Collection('artists', {
 *   mode: 'on'
 * });
 *
 * // Create a collection with a query on it
 * const col3 = new Collection('artists', {
 *   query: (ref) => ref.orderBy('name', 'asc')
 * });
 *
 * @example
 * // In manual mode, just call `fetch` explicitly
 * const col = new Collection('albums', {mode: 'off'});
 * col.fetch().then((collection) => {
 *   collection.docs.forEach((doc) => console.log(doc));
 * });
 *
 * // Yo can use the `isLoading` property to see whether a fetch
 * // is in progress
 * console.log(col.isLoading);
 */
declare class Collection<T extends ICollectionDocument = Document> implements ICollection<T>, IEnhancedObservableDelegate, IHasContext {
    private sourceInput?;
    private sourceCache?;
    private sourceCacheRef?;
    private refDisposerFn?;
    private refObservable;
    private queryInput?;
    private queryRefObservable;
    private onSnapshotRefCache;
    private modeObservable;
    private isLoadingObservable;
    private isLoadedObservable;
    private docLookup;
    private docsObservable;
    private hasDocsObservable;
    private createDocument;
    private onSnapshotUnsubscribe?;
    private observedRefCount;
    private isVerbose;
    private debugInstanceName?;
    private isMinimizingUpdates;
    private initialLocalSnapshotDetectTime?;
    private initialLocalSnapshotDebounceTime?;
    private readyPromise?;
    private readyResolveFn?;
    private initialLocalSnapshotStartTime?;
    private initialLocalSnapshotDebounceTimer?;
    private ctx?;
    constructor(source?: CollectionSource, options?: ICollectionOptions<T>);
    /**
     * Array of all the documents that have been fetched
     * from firestore.
     *
     * @type {Array}
     *
     * @example
     * collection.docs.forEach((doc) => {
     *   console.log(doc.data);
     * });
     */
    get docs(): T[];
    /**
     * True whenever the docs array is not empty.
     *
     * @type {boolean}
     */
    get hasDocs(): boolean;
    /**
     * Firestore collection reference.
     *
     * Use this property to get or set the collection
     * reference. When set, a fetch to the new collection
     * is performed.
     *
     * Alternatively, you can also use `path` to change the
     * reference in more a readable way.
     *
     * @type {firestore.CollectionReference | Function}
     *
     * @example
     * const col = new Collection(firebase.firestore().collection('albums/splinter/tracks'));
     * ...
     * // Switch to another collection
     * col.ref = firebase.firestore().collection('albums/americana/tracks');
     */
    get ref(): CollectionReference | undefined;
    set ref(ref: CollectionReference | undefined);
    /**
     * Id of the Firestore collection (e.g. 'tracks').
     *
     * To get the full-path of the collection, use `path`.
     *
     * @type {string}
     */
    get id(): string | undefined;
    /**
     * Path of the collection (e.g. 'albums/blackAlbum/tracks').
     *
     * Use this property to switch to another collection in
     * the back-end. Effectively, it is a more compact
     * and readable way of setting a new ref.
     *
     * @type {string | Function}
     *
     * @example
     * const col = new Collection('artists/Metallica/albums');
     * ...
     * // Switch to another collection in the back-end
     * col.path = 'artists/EaglesOfDeathMetal/albums';
     */
    get path(): string | undefined;
    set path(collectionPath: string | undefined);
    /**
     * @private
     */
    get source(): CollectionSource | undefined;
    set source(source: CollectionSource | undefined);
    /**
     * Use this property to set any order-by, where,
     * limit or start/end criteria. When set, that query
     * is used to retrieve any data. When cleared (`undefined`),
     * the collection reference is used.
     *
     * The query can be a Function of the form
     * `(firestore.CollectionReference) => firestore.Query | null | undefined`.
     * Where returning `null` will result in an empty collection,
     * and returning `undefined` will revert to using the collection
     * reference (the entire collection).
     *
     * If the query function makes use of any observable values then
     * it will be re-run when those values change.
     *
     * query can be set to a direct Firestore `Query` object but this
     * is an uncommon usage.
     *
     * @type {firestore.Query | Function}
     *
     * @example
     * const todos = new Collection('todos');
     *
     * // Sort the collection
     * todos.query = (ref) => ref.orderBy('text', 'asc');
     *
     * // Order, filter & limit
     * todos.query = (ref) => ref.where('finished', '==', false).orderBy('finished', 'asc').limit(20);
     *
     * // React to changes in observable and force empty collection when required
     * todos.query = (ref) => authStore.uid ? ref.where('owner', '==', authStore.uid) : null;
     *
     * // Clear the query, will cause whole collection to be fetched
     * todos.query = undefined;
     */
    get query(): CollectionQuery | undefined;
    set query(query: CollectionQuery | undefined);
    /**
     * @private
     * firestore.Query -> a valid query exists, use that
     * null -> the query function returned `null` to disable the collection
     * undefined -> no query defined, use collection ref instead
     */
    get queryRef(): Query | null | undefined;
    /**
     * Real-time updating mode.
     *
     * Can be set to any of the following values:
     * - "auto" (enables real-time updating when the collection is observed)
     * - "off" (no real-time updating, you need to call fetch explicitly)
     * - "on" (real-time updating is permanently enabled)
     *
     * @type {string}
     */
    get mode(): Mode;
    set mode(mode: Mode);
    /**
     * Returns true when the Collection is actively listening
     * for changes in the firestore back-end.
     *
     * @type {boolean}
     */
    get isActive(): boolean;
    /**
     * Fetches new data from firestore. Use this to manually fetch
     * new data when `mode` is set to 'off'.
     *
     * @return {Promise}
     * @fulfil {Collection} - This collection
     * @reject {Error} - Error describing the cause of the problem
     *
     * @example
     * const col = new Collection('albums', 'off');
     * col.fetch().then(({docs}) => {
     *   docs.forEach(doc => console.log(doc));
     * });
     */
    fetch(): Promise<Collection<T>>;
    /**
     * True when new data is being loaded.
     *
     * Fetches are performed in these cases:
     *
     * - When real-time updating is started
     * - When a different `ref` or `path` is set
     * - When a `query` is set or cleared
     * - When `fetch` is explicitly called
     *
     * @type {boolean}
     *
     * @example
     * const col = new Collection('albums', {mode: 'off'});
     * console.log(col.isLoading);  // false
     * col.fetch();                 // start fetch
     * console.log(col.isLoading);  // true
     * await col.ready();           // wait for fetch to complete
     * console.log(col.isLoading);  // false
     *
     * @example
     * const col = new Collection('albums');
     * console.log(col.isLoading);  // false
     * const dispose = autorun(() => {
     *   console.log(col.docs);     // start observing collection data
     * });
     * console.log(col.isLoading);  // true
     * ...
     * dispose();                   // stop observing collection data
     * console.log(col.isLoading);  // false
     */
    get isLoading(): boolean;
    /**
     * True when a query snapshot has been retrieved at least once.
     * This however does not mean that any documents have been retrieved,
     * as the number of returned document may have been 0.
     * Use `hasDocs` to check whether any documents have been retrieved.
     *
     * @type {boolean}
     */
    get isLoaded(): boolean;
    /**
     * Promise that is resolved when the Collection has
     * finished fetching its (initial) documents.
     *
     * Use this method to for instance wait for
     * the initial snapshot update to complete, or to wait
     * for fresh data after changing the path/ref.
     *
     * @return {Promise}
     *
     * @example
     * const col = new Collection('albums', {mode: 'on'});
     * await col.ready();
     * console.log('albums: ', col.docs);
     *
     * @example
     * const col = new Collection('artists/FooFighters/albums', {mode: 'on'});
     * await col.ready();
     * ...
     * // Changing the path causes a new snapshot update
     * col.path = 'artists/TheOffspring/albums';
     * await col.ready();
     * console.log('albums: ', col.docs);
     */
    ready(): Promise<null>;
    /**
     * Add a new document to this collection with the specified
     * data, assigning it a document ID automatically.
     *
     * @param {Object} data - JSON data for the new document
     * @return {Promise}
     * @fulfil {Document} - The newly created document
     * @reject {Error} - Error, e.g. a schema validation error or Firestore error
     *
     * @example
     * const doc = await collection.add({
     *   finished: false,
     *   text: 'New todo',
     *   options: {
     *     highPrio: true
     *   }
     * });
     * console.log(doc.id); // print id of new document
     *
     * @example
     * // If you want to create a document with a custom Id, then
     * // use the Document class instead, like this
     * const docWithCustomId = new Document('todos/mytodoid');
     * await docWithCustomId.set({
     *   finished: false,
     *   text: 'New todo',
     * });
     */
    add(data: any): Promise<T>;
    /**
     * Deletes all the documents in the collection or query.
     * @ignore
     * TODO - Not implemented yet
     */
    deleteAll(): Promise<void>;
    toString(): string;
    /**
     * @private
     */
    get debugName(): string;
    /**
     * @private
     */
    get context(): IContext | undefined;
    /**
     * Limit used for query pagination.
     */
    /**
     * Paginates to the start of the collection,
     * resetting any pagination cursor that exists.
     */
    /**
     * Paginates to the next page. This sets the cursor
     * to `startAfter` the last document.
     *
     * @return {Boolean} False in case pagination was not possible
     */
    /**
     * Paginates to the previous page. This sets the cursor
     * to `endBefore` the first document in `docs`.
     *
     * @return {Boolean} False in case pagination was not possible
     */
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
    protected _ready(complete: boolean): void;
    protected _resolveRef(source?: CollectionSource): CollectionReference | undefined;
    protected _resolveQuery(collectionRef: CollectionReference, query?: CollectionQuery): Query | null | undefined;
    /**
     * @private
     */
    protected _onSnapshot(snapshot: QuerySnapshot): void;
    /**
     * @private
     */
    protected _onSnapshotError(error: Error): void;
    /**
     * @private
     */
    private _updateFromSnapshot;
    /**
     * @private
     */
    private _updateRealtimeUpdates;
}
export default Collection;
