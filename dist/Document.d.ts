import type { DocumentReference, DocumentSnapshot } from 'firebase/firestore';
import { DocumentSource, ICollectionDocument, IDocumentOptions, IEnhancedObservableDelegate, Mode, IContext, IHasContext } from './Types';
/**
 * Document represents a document stored in the firestore database.
 * Document is observable so that it can be efficiently linked to for instance
 * a React Component using `mobx-react`'s `observer` pattern. This ensures that
 * a component is only re-rendered when data that is accessed in the `render`
 * function has changed.
 *
 * @param {DocumentSource} [source] String-path, ref or function that returns a path or ref
 * @param {Object} [options] Configuration options
 * @param {String} [options.mode] See `Document.mode` (default: auto)
 * @param {Function} [options.schema] Superstruct schema for data validation
 * @param {firestore.DocumentSnapshot} [options.snapshot] Initial document snapshot
 * @param {firestore.SnapshotOptions} [options.snapshotOptions] Options that configure how data is retrieved from a snapshot
 * @param {boolean} [options.debug] Enables debug logging
 * @param {String} [options.debugName] Name to use when debug logging is enabled
 */
declare class Document<T extends object = object> implements ICollectionDocument, IEnhancedObservableDelegate, IHasContext {
    private sourceInput;
    private sourceDisposerFn?;
    private refObservable;
    private snapshotObservable;
    private snapshotOptions?;
    private docSchema?;
    private isVerbose;
    private debugInstanceName?;
    private collectionRefCount;
    private observedRefCount;
    private dataObservable;
    private modeObservable;
    private isLoadingObservable;
    private onSnapshotUnsubscribeFn?;
    private readyPromise?;
    private readyResolveFn?;
    private ctx?;
    constructor(source?: DocumentSource, options?: IDocumentOptions);
    /**
     * Returns the superstruct schema used to validate the
     * document, or undefined.
     *
     * @type {Function}
     */
    get schema(): ((data: any) => any) | undefined;
    /**
     * Returns the data inside the firestore document.
     *
     * @type {Object}
     *
     * @example
     * todos.docs.map((doc) => {
     *   console.log(doc.data);
     *   // {
     *   //   finished: false
     *   //   text: 'Must do this'
     *   // }
     * });
     */
    get data(): T;
    /**
     * True whenever the document has fetched any data.
     *
     * @type {boolean}
     */
    get hasData(): boolean;
    /**
     * Firestore document reference.
     *
     * Use this property to get or set the
     * underlying document reference.
     *
     * Alternatively, you can also use `path` to change the
     * reference in more a readable way.
     *
     * @type {firestore.DocumentReference | Function}
     *
     * @example
     * const doc = new Document('albums/splinter');
     *
     * // Get the DocumentReference for `albums/splinter`
     * const ref = doc.ref;
     *
     * // Switch to another document
     * doc.ref = firebase.firestore().doc('albums/americana');
     */
    get ref(): DocumentReference | undefined;
    set ref(ref: DocumentReference | undefined);
    /**
     * Id of the firestore document.
     *
     * To get the full-path of the document, use `path`.
     *
     * @type {string}
     */
    get id(): string | undefined;
    /**
     * Path of the document (e.g. 'albums/blackAlbum').
     *
     * Use this property to switch to another document in
     * the back-end. Effectively, it is a more compact
     * and readable way of setting a new ref.
     *
     * @type {string | Function}
     *
     * @example
     * const doc = new Document('artists/Metallica');
     * ...
     * // Switch to another document in the back-end
     * doc.path = 'artists/EaglesOfDeathMetal';
     *
     * // Or, you can use a reactive function to link
     * // to the contents of another document.
     * const doc2 = new Document('settings/activeArtist');
     * doc.path = () => 'artists/' + doc2.data.artistId;
     */
    get path(): string | (() => string | undefined) | undefined;
    set path(documentPath: string | (() => string | undefined) | undefined);
    /**
     * @private
     */
    get source(): DocumentSource;
    set source(source: DocumentSource);
    /**
     * Real-time updating mode.
     *
     * Can be set to any of the following values:
     * - "auto" (enables real-time updating when the document becomes observed)
     * - "off" (no real-time updating, you need to call fetch explicitly)
     * - "on" (real-time updating is permanently enabled)
     *
     * @type {string}
     */
    get mode(): Mode;
    set mode(mode: Mode);
    /**
     * Returns true when the Document is actively listening
     * for changes in the firestore back-end.
     *
     * @type {boolean}
     */
    get isActive(): boolean;
    /**
     * Underlying firestore snapshot.
     *
     * @type {firestore.DocumentSnapshot}
     */
    get snapshot(): DocumentSnapshot | undefined;
    /**
     * Updates one or more fields in the document.
     *
     * The update will fail if applied to a document that does
     * not exist.
     *
     * @param {Object} fields - Fields to update
     * @return {Promise}
     *
     * @example
     * await todoDoc.update({
     *   finished: true,
     *   text: 'O yeah, checked this one off',
     *   foo: {
     *     bar: 10
     *   }
     * });
     */
    update(fields: object): Promise<void>;
    /**
     * Writes to the document.
     *
     * If the document does not exist yet, it will be created.
     * If you pass options, the provided data can be merged into
     * the existing document.
     *
     * @param {Object} data - An object of the fields and values for the document
     * @param {Object} [options] - Set behaviour options
     * @param {Boolean} [options.merge] - Set to `true` to only replace the values specified in the data argument. Fields omitted will remain untouched.
     * @return {Promise}
     *
     * @example
     * const todo = new Document('todos/mynewtodo');
     * await todo.set({
     *   finished: false,
     *   text: 'this is awesome'
     * });
     */
    set(data: any, options?: any): Promise<void>;
    /**
     * Deletes the document in Firestore.
     *
     * Returns a promise that resolves once the document has been
     * successfully deleted from the backend (Note that it won't
     * resolve while you're offline).
     *
     * @return {Promise}
     */
    delete(): Promise<void>;
    /**
     * Fetches new data from firestore. Use this to manually fetch
     * new data when `mode` is set to 'off'.
     *
     * @return {Promise}
     * @fullfil {Document<T>} This document
     *
     * @example
     * const doc = new Document('albums/splinter');
     * await doc.fetch();
     * console.log('data: ', doc.data);
     */
    fetch(): Promise<Document<T>>;
    /**
     * True when new data is being loaded.
     *
     * Loads are performed in these cases:
     *
     * - When real-time updating is started
     * - When a different `ref` or `path` is set
     * - When a `query` is set or cleared
     * - When `fetch` is explicitly called
     *
     * @type {boolean}
     *
     * @example
     * const doc = new Document('albums/splinter', {mode: 'off'});
     * console.log(doc.isLoading); 	// false
     * doc.fetch(); 								// start fetch
     * console.log(doc.isLoading); 	// true
     * await doc.ready(); 					// wait for fetch to complete
     * console.log(doc.isLoading); 	// false
     *
     * @example
     * const doc = new Document('albums/splinter');
     * console.log(doc.isLoading); 	// false
     * const dispose = autorun(() => {
     *   console.log(doc.data);			// start observing document data
     * });
     * console.log(doc.isLoading); 	// true
     * ...
     * dispose();										// stop observing document data
     * console.log(doc.isLoading); 	// false
     */
    get isLoading(): boolean;
    /**
     * True when a snapshot has been obtained from the Firestore
     * back-end. This property indicates whether an initial fetch/get call
     * to Firestore has completed processing. This doesn't however mean that data
     * is available, as the returned snapshot may contain a value indicating
     * that the document doesn't exist. Use `hasData` to check whether any
     * data was succesfully retrieved.
     *
     * @type {boolean}
     */
    get isLoaded(): boolean;
    /**
     * Promise that is resolved when the Document has
     * data ready to be consumed.
     *
     * Use this function to for instance wait for
     * the initial snapshot update to complete, or to wait
     * for fresh data after changing the path/ref.
     *
     * @return {Promise}
     *
     * @example
     * const doc = new Document('albums/splinter', {mode: 'on'});
     * await doc.ready();
     * console.log('data: ', doc.data);
     *
     * @example
     * const doc = new Document('albums/splinter', {mode: 'on'});
     * await doc.ready();
     * ...
     * // Changing the path causes a new snapshot update
     * doc.path = 'albums/americana';
     * await doc.ready();
     * console.log('data: ', doc.data);
     */
    ready(): Promise<void>;
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
     * ICollectionDocument
     * @private
     */
    addCollectionRef(): number;
    releaseCollectionRef(): number;
    updateFromCollectionSnapshot(snapshot: DocumentSnapshot): void;
    /**
     * @private
     */
    _updateFromSnapshot(snapshot?: DocumentSnapshot): void;
    /**
     * @private
     */
    protected _ready(complete: boolean): void;
    /**
     * @private
     */
    protected _onSnapshot(snapshot: DocumentSnapshot): void;
    /**
     * @private
     */
    protected _onSnapshotError(error: Error): void;
    /**
     * @private
     */
    private _updateRealtimeUpdates;
    /**
     * @private
     */
    private _updateSourceObserver;
    /**
     * @private
     */
    private _validateSchema;
}
export default Document;
