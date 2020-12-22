import type Firebase from 'firebase';
import { IObservableArray, IObservableValue, observable, reaction, runInAction } from 'mobx';

import Document from './Document';
import {
  CollectionQuery,
  CollectionSource,
  DocumentSource,
  ICollectionDocument,
  ICollectionOptions,
  ICollection,
  IDocumentOptions,
  IEnhancedObservableDelegate,
  Mode,
} from './Types';
import { verifyMode } from './Utils';
import { enhancedObservable } from './enhancedObservable';
import { getFirestore, IContext, IHasContext } from './init';

// * @param {Number} [options.limit] Maximum number of documents to fetch (see `Collection.limit`)

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
class Collection<T extends ICollectionDocument = Document>
  implements ICollection<T>, IEnhancedObservableDelegate, IHasContext {
  private sourceInput: CollectionSource;
  private sourceCache: CollectionSource;
  private sourceCacheRef: Firebase.firestore.CollectionReference;
  private refDisposerFn: () => void;
  private refObservable: IObservableValue<Firebase.firestore.CollectionReference | undefined>;
  private queryInput?: CollectionQuery;
  private queryRefObservable: IObservableValue<Firebase.firestore.Query | null | undefined>;
  private onSnapshotRefCache?: Firebase.firestore.Query;
  private modeObservable: IObservableValue<Mode>;
  private isLoadingObservable: IObservableValue<boolean>;
  private isLoadedObservable: IObservableValue<boolean>;
  private docLookup: { [name: string]: T };
  private docsObservable: IObservableArray<T>;
  private hasDocsObservable: IObservableValue<boolean>;
  private createDocument: (source: DocumentSource, options: IDocumentOptions) => T;
  private onSnapshotUnsubscribe: () => void;
  private observedRefCount: number;
  private isVerbose: boolean;
  private debugInstanceName?: string;
  private isMinimizingUpdates: boolean;
  private initialLocalSnapshotDetectTime?: number;
  private initialLocalSnapshotDebounceTime?: number;
  private readyPromise?: Promise<void>;
  private readyResolveFn?: () => void;
  private initialLocalSnapshotStartTime?: number;
  private initialLocalSnapshotDebounceTimer?: any;
  private ctx?: IContext;
  // private _limit: any;
  // private _cursor: any;

  constructor(source?: CollectionSource, options: ICollectionOptions<T> = {}) {
    const {
      query,
      createDocument,
      mode,
      // limit,
      debug,
      debugName,
      minimizeUpdates = false,
      initialLocalSnapshotDetectTime = 50,
      initialLocalSnapshotDebounceTime = 1000,
      context,
    } = options;
    this.isVerbose = debug || false;
    this.debugInstanceName = debugName;
    this.isMinimizingUpdates = minimizeUpdates;
    this.initialLocalSnapshotDetectTime = initialLocalSnapshotDetectTime;
    this.initialLocalSnapshotDebounceTime = initialLocalSnapshotDebounceTime;
    this.docLookup = {};
    this.observedRefCount = 0;
    this.sourceInput = source;
    this.refObservable = observable.box(undefined);
    this.queryInput = query;
    this.queryRefObservable = observable.box(undefined);
    // this._limit = observable.box(limit || undefined);
    // this._cursor = observable.box(undefined);
    this.modeObservable = observable.box(verifyMode(mode || Mode.Auto));
    this.isLoadingObservable = observable.box(false);
    this.isLoadedObservable = observable.box(false);
    this.hasDocsObservable = enhancedObservable(false, this);
    this.docsObservable = enhancedObservable([], this);
    this.ctx = context;

    if (createDocument) {
      this.createDocument = createDocument;
    } else {
      this.createDocument = (docSource: DocumentSource, docOptions: IDocumentOptions): T =>
        (new Document(docSource, docOptions) as unknown) as T;
    }

    runInAction(() => this._updateRealtimeUpdates(true, true));
  }

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
  public get docs(): T[] {
    return this.docsObservable;
  }

  /**
   * True whenever the docs array is not empty.
   *
   * @type {boolean}
   */
  public get hasDocs(): boolean {
    return this.hasDocsObservable.get();
  }

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
  public get ref(): Firebase.firestore.CollectionReference | undefined {
    let ref = this.refObservable.get();
    if (!this.refDisposerFn) {
      ref = this._resolveRef(this.sourceInput);
    }
    return ref;
  }
  public set ref(ref: Firebase.firestore.CollectionReference | undefined) {
    this.source = ref;
  }

  /**
   * Id of the Firestore collection (e.g. 'tracks').
   *
   * To get the full-path of the collection, use `path`.
   *
   * @type {string}
   */
  public get id(): string | undefined {
    const ref = this.ref;
    return ref ? ref.id : undefined;
  }

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
  public get path(): string | undefined {
    let ref: any = this.ref;
    if (!ref) {
      return undefined;
    }
    let path = ref.id;
    while (ref.parent) {
      path = ref.parent.id + '/' + path;
      ref = ref.parent;
    }
    return path;
  }
  public set path(collectionPath: string | undefined) {
    this.source = collectionPath;
  }

  /**
   * @private
   */
  public get source(): CollectionSource {
    return this.sourceInput;
  }
  public set source(source: CollectionSource) {
    if (this.sourceInput === source) {
      return;
    }
    runInAction(() => {
      this.sourceInput = source;

      // Stop any reactions
      if (this.refDisposerFn) {
        this.refDisposerFn();
        this.refDisposerFn = undefined;
      }

      // Update real-time updating
      this._updateRealtimeUpdates(true);
    });
  }

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
  public get query(): CollectionQuery | undefined {
    return this.queryInput;
  }
  public set query(query: CollectionQuery | undefined) {
    if (this.queryInput === query) {
      return;
    }
    runInAction(() => {
      this.queryInput = query;

      // Stop any reactions
      if (this.refDisposerFn) {
        this.refDisposerFn();
        this.refDisposerFn = undefined;
      }

      // Update real-time updating
      this._updateRealtimeUpdates(undefined, true);
    });
  }

  /**
   * @private
   * firestore.Query -> a valid query exists, use that
   * null -> the query function returned `null` to disable the collection
   * undefined -> no query defined, use collection ref instead
   */
  public get queryRef(): Firebase.firestore.Query | null | undefined {
    return this.queryRefObservable.get();
  }

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
  public get mode(): Mode {
    return this.modeObservable.get();
  }
  public set mode(mode: Mode) {
    if (this.modeObservable.get() === mode) {
      return;
    }
    verifyMode(mode);
    runInAction(() => {
      this.modeObservable.set(mode);
      this._updateRealtimeUpdates();
    });
  }

  /**
   * Returns true when the Collection is actively listening
   * for changes in the firestore back-end.
   *
   * @type {boolean}
   */
  public get isActive(): boolean {
    return !!this.onSnapshotUnsubscribe;
  }

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
  public async fetch(): Promise<Collection<T>> {
    if (this.isVerbose) {
      console.debug(`${this.debugName} - fetching...`);
    }
    if (this.isActive) {
      throw new Error('Should not call fetch when real-time updating is active');
    }
    if (this.isLoadingObservable.get()) {
      throw new Error('Fetch already in progress');
    }
    const colRef = this._resolveRef(this.sourceInput);
    const queryRef = this._resolveQuery(colRef, this.queryInput);
    const ref = queryRef !== undefined ? queryRef : colRef;
    if (!ref) {
      throw new Error('No ref, path or query set on Collection');
    }
    runInAction(() => {
      this._ready(false);
      this.isLoadingObservable.set(true);
    });
    try {
      const snapshot = await ref.get();
      runInAction(() => {
        this.isLoadingObservable.set(false);
        this._updateFromSnapshot(snapshot);
        if (this.isVerbose) {
          console.debug(`${this.debugName} - fetched ${snapshot.docs.length} documents`);
        }
      });
      this._ready(true);
      return this;
    } catch (err) {
      console.log(`${this.debugName} - fetch failed: ${err.message}`);
      runInAction(() => {
        this.isLoadingObservable.set(false);
        this._updateFromSnapshot(undefined);
        this._ready(true);
      });
      throw err;
    }
  }

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
  public get isLoading(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions, @babel/no-unused-expressions
    this.docsObservable.length;
    return this.isLoadingObservable.get();
  }

  /**
   * True when a query snapshot has been retrieved at least once.
   * This however does not mean that any documents have been retrieved,
   * as the number of returned document may have been 0.
   * Use `hasDocs` to check whether any documents have been retrieved.
   *
   * @type {boolean}
   */
  public get isLoaded(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions, @babel/no-unused-expressions
    this.docsObservable.length;
    return this.isLoadedObservable.get();
  }

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
  public ready(): Promise<void> {
    this.readyPromise = this.readyPromise || Promise.resolve(null);
    return this.readyPromise;
  }

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
  public async add(data: any): Promise<T> {
    const ref = this.ref;
    if (!ref) {
      throw new Error('No valid collection reference');
    }

    // REVISIT: can we know to skip this if schemas not in use?
    // Validate schema using a dummy snapshot
    this.createDocument(undefined, {
      context: this.context,
      snapshot: {
        data: () => data,
        exists: true,
        get: (fieldPath: string) => data[fieldPath],
        id: '',
        isEqual: () => false,
        metadata: undefined,
        ref: undefined,
      },
    });

    // Add to firestore
    const ref2 = await ref.add(data);
    const snapshot = await ref2.get();
    return this.createDocument(snapshot.ref, {
      context: this.context,
      snapshot,
    });
  }

  /**
   * Deletes all the documents in the collection or query.
   * @ignore
   * TODO - Not implemented yet
   */
  public async deleteAll(): Promise<void> {
    const ref = this.ref;
    if (!ref) {
      throw new Error('No valid collection reference');
    }
    // TODO
  }

  public toString(): string {
    return this.debugName;
  }

  /**
   * @private
   */
  public get debugName(): string {
    return `${this.debugInstanceName || this.constructor.name} (${this.path})`;
  }

  /**
   * @private
   */
  public get context(): IContext {
    return this.ctx;
  }

  /**
   * Limit used for query pagination.
   */
  /* get limit(): ?number {
		return this._limit.get();
	}
	set limit(val: ?number) {
		this._limit.set(val || undefined);
	} */

  /**
   * Paginates to the start of the collection,
   * resetting any pagination cursor that exists.
   */
  /* paginateToStart() {
		this._cursor.set(undefined);
	} */

  /**
   * Paginates to the next page. This sets the cursor
   * to `startAfter` the last document.
   *
   * @return {Boolean} False in case pagination was not possible
   */
  /* paginateNext(): boolean {
		if (!this.canPaginateNext) return false;
		this._cursor.set({
			type: 'startAfter',
			value: this.docs[this.docs.length - 1].ref
		});
		return true;
	} */

  /**
   * Paginates to the previous page. This sets the cursor
   * to `endBefore` the first document in `docs`.
   *
   * @return {Boolean} False in case pagination was not possible
   */
  /* paginatePrevious(): boolean {
		if (!this.canPaginatePrevious) return false;
		if (!this.docs.length) {
			this._cursor.set(undefined);
			return true;
		}
		this._cursor.set({
			type: 'endBefore',
			value: this.docs[0].ref
		});
		return true;
	}

	get canPaginateNext(): boolean {
		if (!this.limit) return false;
		return this.docs.length >= this.limit;
	}

	get canPaginatePrevious(): boolean {
		if (!this.limit) return false;
		return this._cursor.get() ? true : false;
	} */

  /**
   * Called whenever a property of this class becomes observed.
   * @private
   */
  public addObserverRef(): number {
    if (this.isVerbose) {
      console.debug(`${this.debugName} - addRef (${this.observedRefCount + 1})`);
    }
    const res = ++this.observedRefCount;
    if (res === 1) {
      runInAction(() => this._updateRealtimeUpdates());
    }
    return res;
  }

  /**
   * Called whenever a property of this class becomes un-observed.
   * @private
   */
  public releaseObserverRef(): number {
    if (this.isVerbose) {
      console.debug(`${this.debugName} - releaseRef (${this.observedRefCount - 1})`);
    }
    const res = --this.observedRefCount;
    if (!res) {
      runInAction(() => this._updateRealtimeUpdates());
    }
    return res;
  }

  protected _ready(complete) {
    if (complete) {
      const readyResolve = this.readyResolveFn;
      if (readyResolve) {
        this.readyResolveFn = undefined;
        readyResolve();
      }
    } else if (!this.readyResolveFn) {
      this.readyPromise = new Promise((resolve) => {
        this.readyResolveFn = resolve;
      });
    }
  }

  protected _resolveRef(source): Firebase.firestore.CollectionReference {
    if (this.sourceCache === source) {
      return this.sourceCacheRef;
    }
    let ref;
    if (typeof source === 'string') {
      ref = getFirestore(this).collection(source);
    } else if (typeof source === 'function') {
      ref = this._resolveRef(source());
      return ref; // don't set cache in this case
    } else {
      ref = source;
    }
    this.sourceCache = source;
    this.sourceCacheRef = ref;
    return ref;
  }

  protected _resolveQuery(
    collectionRef: Firebase.firestore.CollectionReference,
    query?: CollectionQuery
  ): Firebase.firestore.Query | null | undefined {
    let ref: any = query;
    if (typeof query === 'function') {
      ref = query(collectionRef);
    }

    // Apply pagination cursor
    /* const cursor = this._cursor.get();
		if (cursor) {
			ref = ref || collectionRef;
			switch (cursor.type) {
				case 'startAfter': ref = ref.startAfter(cursor.value); break;
				case 'startAt': ref = ref.startAt(cursor.value); break;
				case 'endBefore': ref = ref.endBefore(cursor.value); break;
				case 'endAt': ref = ref.endAt(cursor.value); break;
			}
		}

		// Apply fetch limit
		const limit = this.limit;
		if (limit) {
			ref = ref || collectionRef;
			ref = ref.limit(limit);
		} */
    return ref;
  }

  /**
   * @private
   */
  protected _onSnapshot(snapshot: Firebase.firestore.QuerySnapshot): void {
    // Firestore sometimes returns multiple snapshots initially.
    // The first one containing cached results, followed by a second
    // snapshot which was fetched from the cloud.
    if (this.initialLocalSnapshotDebounceTimer) {
      clearTimeout(this.initialLocalSnapshotDebounceTimer);
      this.initialLocalSnapshotDebounceTimer = undefined;
      if (this.isVerbose) {
        console.debug(
          `${this.debugName} - cancelling initial debounced snapshot, because a newer snapshot has been received`
        );
      }
    }
    if (this.isMinimizingUpdates) {
      const timeElapsed = Date.now() - this.initialLocalSnapshotStartTime;
      this.initialLocalSnapshotStartTime = 0;
      if (timeElapsed >= 0 && timeElapsed < this.initialLocalSnapshotDetectTime) {
        if (this.isVerbose) {
          console.debug(
            `${this.debugName} - local snapshot detected (${timeElapsed}ms < ${this.initialLocalSnapshotDetectTime}ms threshold), debouncing ${this.initialLocalSnapshotDebounceTime} msec...`
          );
        }
        this.initialLocalSnapshotDebounceTimer = setTimeout(() => {
          this.initialLocalSnapshotDebounceTimer = undefined;
          this._onSnapshot(snapshot);
        }, this.initialLocalSnapshotDebounceTime);
        return;
      }
    }

    // Process snapshot
    runInAction(() => {
      if (this.isVerbose) {
        console.debug(`${this.debugName} - onSnapshot`);
      }
      this.isLoadingObservable.set(false);
      this._updateFromSnapshot(snapshot);
      this._ready(true);
    });
  }

  /**
   * @private
   */
  protected _onSnapshotError(error: Error): void {
    console.warn(`${this.debugName} - onSnapshotError: ${error.message}`);
  }

  /**
   * @private
   */
  private _updateFromSnapshot(snapshot?: Firebase.firestore.QuerySnapshot): void {
    const newDocs = [];
    if (snapshot) {
      snapshot.docs.forEach((docSnapshot: Firebase.firestore.DocumentSnapshot) => {
        let doc = this.docLookup[docSnapshot.id];
        try {
          if (doc) {
            doc.updateFromCollectionSnapshot(docSnapshot);
          } else {
            doc = this.createDocument(docSnapshot.ref, {
              context: this.context,
              snapshot: docSnapshot,
            });
            this.docLookup[doc.id] = doc;
          }
          doc.addCollectionRef();
          newDocs.push(doc);
        } catch (err) {
          console.error(err.message);
        }
      });
    }
    this.docsObservable.forEach((doc) => {
      if (!doc.releaseCollectionRef()) {
        delete this.docLookup[doc.id || ''];
      }
    });

    this.hasDocsObservable.set(!!newDocs.length);
    this.isLoadedObservable.set(true);
    if (this.docsObservable.length !== newDocs.length) {
      this.docsObservable.replace(newDocs);
    } else {
      for (let i = 0, n = newDocs.length; i < n; i++) {
        if (newDocs[i] !== this.docsObservable[i]) {
          this.docsObservable.replace(newDocs);
          break;
        }
      }
    }
  }

  /**
   * @private
   */
  private _updateRealtimeUpdates(updateSourceRef?: boolean, updateQueryRef?: boolean): void {
    let newActive = false;
    const active = !!this.onSnapshotUnsubscribe;
    switch (this.modeObservable.get()) {
      case Mode.Auto:
        newActive = !!this.observedRefCount;
        break;
      case Mode.Off:
        newActive = false;
        break;
      case Mode.On:
        newActive = true;
        break;
    }

    // Update source & query ref if needed
    if (newActive && !active) {
      updateSourceRef = true;
      updateQueryRef = true;
    }
    if (updateSourceRef) {
      this.refObservable.set(this._resolveRef(this.sourceInput));
    }
    if (updateQueryRef) {
      this.queryRefObservable.set(this._resolveQuery(this.refObservable.get(), this.queryInput));
    }

    // Upon de-activation, stop any observed reactions or
    // snapshot listeners.
    if (!newActive) {
      if (this.refDisposerFn) {
        this.refDisposerFn();
        this.refDisposerFn = undefined;
      }
      this.onSnapshotRefCache = undefined;
      if (this.onSnapshotUnsubscribe) {
        if (this.isVerbose) {
          console.debug(
            `${this.debugName} - stop (${this.modeObservable.get()}:${this.observedRefCount})`
          );
        }
        this.onSnapshotUnsubscribe();
        this.onSnapshotUnsubscribe = undefined;
        if (this.isLoadingObservable.get()) {
          this.isLoadingObservable.set(false);
        }
        this._ready(true);
      }
      return;
    }

    // Start listening for ref-changes
    if (!this.refDisposerFn) {
      let initialSourceRef = this.refObservable.get();
      let initialQueryRef = this.queryRefObservable.get();
      this.refDisposerFn = reaction(
        () => {
          let sourceRef = this._resolveRef(this.sourceInput);
          let queryRef2 = this._resolveQuery(sourceRef, this.queryInput);
          if (initialSourceRef) {
            sourceRef = initialSourceRef;
            queryRef2 = initialQueryRef;
            initialSourceRef = undefined;
            initialQueryRef = undefined;
          }
          return {
            queryRef2,
            sourceRef,
          };
        },
        ({ sourceRef, queryRef2 }) => {
          runInAction(() => {
            if (
              this.refObservable.get() !== sourceRef ||
              this.queryRefObservable.get() !== queryRef2
            ) {
              this.refObservable.set(sourceRef);
              this.queryRefObservable.set(queryRef2);
              this._updateRealtimeUpdates();
            }
          });
        }
      );
    }

    // Resolve ref and check whether it has changed
    const queryRef = this.queryRefObservable.get();
    const ref = queryRef !== undefined ? queryRef : this.refObservable.get();
    if (this.onSnapshotRefCache === ref) {
      return;
    }
    this.onSnapshotRefCache = ref;

    // Stop any existing listener
    if (this.onSnapshotUnsubscribe) {
      this.onSnapshotUnsubscribe();
      this.onSnapshotUnsubscribe = undefined;
    }

    // If no valid ref exists, then clear the collection so no "old"
    // documents are visible.
    if (!ref) {
      if (this.docsObservable.length) {
        this._updateFromSnapshot({
          docChanges: (options?: Firebase.firestore.SnapshotListenOptions) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions, @babel/no-unused-expressions
            options;
            return [];
          },
          docs: [],
          empty: true,
          forEach: () => true,
          isEqual: () => false,
          metadata: undefined,
          query: queryRef,
          size: 0,
        });
      }
      return;
    }

    // Start listener
    if (this.isVerbose) {
      console.debug(
        `${this.debugName} - ${active ? 're-' : ''}start (${this.modeObservable.get()}:${
          this.observedRefCount
        })`
      );
    }
    this._ready(false);
    this.isLoadingObservable.set(true);
    this.initialLocalSnapshotStartTime = Date.now();
    this.onSnapshotUnsubscribe = ref.onSnapshot(
      (snapshot) => this._onSnapshot(snapshot),
      (err) => this._onSnapshotError(err)
    );
  }
}

export default Collection;
