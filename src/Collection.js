// @flow
import { observable, transaction, reaction } from 'mobx';
import { enhancedObservable } from './enhancedObservable';
import { getFirestore, verifyMode } from './init';
import Document from './Document';

import type {
	QuerySnapshot,
	Query,
	DocumentSnapshot,
	CollectionReference
} from 'firebase/firestore';

/**
 * @private
 */
function resolveRef(value) {
	if (typeof value === 'string') {
		return getFirestore().collection(value);
	} else if (typeof value === 'function') {
		return resolveRef(value());
	} else {
		return value;
	}
}

function resolveQuery(value) {
	if (typeof value === 'function') {
		return resolveQuery(value());
	} else {
		return value;
	}
}

/**
 * The Collection class lays at the heart of `firestorter`.
 * It represents a collection in Firestore and its queried data. It is
 * observable so that it can be efficiently linked to a React Component
 * using `mobx-react`'s `observer` pattern.
 *
 * Collection supports three modes of real-time updating:
 * - "off" (real-time updating is turned off)
 * - "on" (real-time updating is permanently turned on)
 * - "auto" (real-time updating is enabled on demand) (default)
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
 * @param {Object} [options] Configuration options
 * @param
 * @param {Query} [options.query] See `Document.query`
 * @param {String} [options.mode] See `Document.mode`
 * @param {String} [options.DocumentClass] Document classes to create (must be inherited from Document)
 * @param {Bool} [options.debug] Enables debug logging
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
 * // Create a collection and set a query on it
 * const col3 = new Collection('artists');
 * col3.query = col3.ref.orderBy('name', 'asc');
 *
 * @example
 * // In manual mode, just call `fetch` explicitely
 * const col = new Collection('albums');
 * col.fetch().then((collection) => {
 *	 collection.docs.forEach((doc) => console.log(doc));
 * });
 *
 * // Yo can use the `fetching` property to see whether a fetch
 * // is in progress
 * console.log(col.fetching);
 */
class Collection {
	static EMPTY_OPTIONS = {};

	_source: any;
	_sourceDisposer: any;
	_docLookup: { [string]: Document };
	_ref: any;
	_querySource: any;
	_querySourceDisposer: any;
	_query: any;
	_mode: any;
	_fetching: any;
	_docs: any;
	_documentClass: any;
	_onSnapshotUnsubscribe: any;
	_observedRefCount: number;
	_debug: boolean;
	_debugName: ?string;

	constructor(
		source: CollectionReference | string | (() => string | void),
		options: any
	) {
		const {
			query,
			DocumentClass = Document,
			mode,
			realtimeUpdating,
			debug,
			debugName
		} =
			options || Collection.EMPTY_OPTIONS;
		this._documentClass = DocumentClass;
		this._debug = debug || false;
		this._debugName = debugName;
		this._docLookup = {};
		this._observedRefCount = 0;
		this._source = source;
		this._ref = observable(resolveRef(source));
		this._querySource = query;
		this._query = observable(resolveQuery(query));
		if (realtimeUpdating) {
			console.warn(
				'realtimeUpdating option has been deprecated and will be removed soon, please use `mode` instead'
			);
		}
		this._mode = observable(verifyMode(mode || realtimeUpdating || 'auto'));
		this._fetching = observable(false);
		this._docs = enhancedObservable([], this);
		this._updateSourceObserver();
		this._updateQuerySourceObserver();
		if (mode === 'on') this._updateRealtimeUpdates();
	}

	/**
	 * Array of all the documents that have been fetched
	 * from firestore.
	 *
	 * @example
	 * collection.docs.forEach((doc) => {
	 *   console.log(doc.data);
	 * });
	 */
	get docs(): Array<Document> {
		return this._docs;
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
	 * @example
	 * const col = new Collection(firebase.firestore().collection('albums/splinter/tracks'));
	 * ...
	 * // Switch to another collection
	 * col.ref = firebase.firestore().collection('albums/americana/tracks');
	 */
	get ref(): ?CollectionReference {
		return this._ref.get();
	}
	set ref(ref: ?CollectionReference) {
		this.source = ref;
	}

	/**
	 * Id of the Firestore collection (e.g. 'tracks').
	 *
	 * To get the full-path of the collection, use `path`.
	 */
	get id(): ?string {
		const ref = this._ref.get();
		return ref ? ref.id : undefined;
	}

	/**
	 * Path of the collection (e.g. 'albums/blackAlbum/tracks').
	 *
	 * Use this property to switch to another collection in
	 * the back-end. Effectively, it is a more compact
	 * and readable way of setting a new ref.
	 *
	 * @example
	 * const col = new Collection('artists/Metallica/albums');
	 * ...
	 * // Switch to another collection in the back-end
	 * col.path = 'artists/EaglesOfDeathMetal/albums';
	 */
	get path(): ?string {
		let ref = this._ref.get();
		if (!ref) return undefined;
		let path = ref.id;
		while (ref.parent) {
			path = ref.parent.id + '/' + path;
			ref = ref.parent;
		}
		return path;
	}
	set path(collectionPath: ?string) {
		this.source = collectionPath;
	}

	/**
	 * @private
	 */
	get source(): ?any {
		return this._source.get();
	}
	set source(source: ?any) {
		if (this._source === source) return;
		this._source = source;
		this._updateSourceObserver();
		transaction(() => {
			this._ref.set(resolveRef(source));
			this._updateRealtimeUpdates(this._query.get() ? false : true);
		});
	}

	/**
	 * @private
	 */
	_updateSourceObserver() {
		if (this._sourceDisposer) {
			this._sourceDisposer();
			this._sourceDisposer = undefined;
		}
		if (typeof this._source === 'function') {
			this._sourceDisposer = reaction(
				() => this._source(),
				value => {
					transaction(() => {
						// TODO, check whether path has changed
						this._ref.set(resolveRef(value));
						this._updateRealtimeUpdates(this._query.get() ? false : true);
					});
				}
			);
		}
	}

	/**
	 * Firestore query.
	 *
	 * Use this property to set any order-by, where,
	 * limit or start/end criteria. When set, that query
	 * is used to retrieve any data. When cleared, the collection
	 * reference is used.
	 *
	 * @example
	 * const todos = new Collection('todos');
	 *
	 * // Sort the collection
	 * todos.query = todos.ref.orderBy('text', 'asc');
	 *
	 * // Order, filter & limit
	 * todos.query = todos.ref.where('finished', '==', false).orderBy('finished', 'asc').limit(20);
	 *
	 * // Clear the query, will cause whole collection to be fetched
	 * todos.query = undefined;
	 */
	get query(): ?Query {
		return this._query.get();
	}
	set query(query?: Query | (() => Query)) {
		this.querySource = query;
	}

	/**
	 * @private
	 */
	get querySource(): ?any {
		return this._querySource.get();
	}
	set querySource(source: ?any) {
		if (this._querySource === source) return;
		this._querySource = source;
		this._updateQuerySourceObserver();
		transaction(() => {
			this._query.set(resolveQuery(source));
			this._updateRealtimeUpdates(true);
		});
	}

	/**
	 * @private
	 */
	_updateQuerySourceObserver() {
		if (this._querySourceDisposer) {
			this._querySourceDisposer();
			this._querySourceDisposer = undefined;
		}
		if (typeof this._querySource === 'function') {
			this._querySourceDisposer = reaction(
				() => this._querySource(),
				value => {
					transaction(() => {
						// TODO, check whether path has changed
						this._query.set(resolveQuery(value));
						this._updateRealtimeUpdates(true);
					});
				}
			);
		}
	}

	/**
	 * Real-time updating mode.
	 *
	 * Can be set to any of the following values:
	 * - "auto" (enables real-time updating when the collection is observed)
	 * - "off" (no real-time updating, you need to call fetch explicitly)
	 * - "on" (real-time updating is permanently enabled)
	 */
	get mode(): string {
		return this._mode.get();
	}
	set mode(mode: string) {
		if (this._mode.get() === mode) return;
		verifyMode(mode);
		transaction(() => {
			this._mode.set(mode);
			this._updateRealtimeUpdates();
		});
	}

	/**
	 * @private
	 */
	get realtimeUpdating(): string {
		console.warn(
			'Collection.realtimeUpdating has been deprecated and will be removed soon, please use `mode` instead'
		);
		return this.mode;
	}
	set realtimeUpdating(mode: string) {
		console.warn(
			'Collection.realtimeUpdating has been deprecated and will be removed soon, please use `mode` instead'
		);
		this.mode = mode;
	}

	/**
	 * Returns true when the Collection is actively listening
	 * for changes in the firestore back-end.
	 */
	get active(): boolean {
		return !!this._onSnapshotUnsubscribe;
	}

	/**
	 * Fetches new data from firestore. Use this to manually fetch
	 * new data when `mode` is set to 'off'.
	 *
	 * @example
	 * const col = new Collection('albums', 'off');
	 * col.fetch().then(({docs}) => {
	 *   docs.forEach(doc => console.log(doc));
	 * });
	 */
	fetch(): Promise<Collection> {
		return new Promise((resolve, reject) => {
			if (this.active)
				return reject(
					new Error('Should not call fetch when real-time updating is active')
				);
			if (this._fetching.get())
				return reject(new Error('Fetch already in progress'));
			const ref = this._query.get() || this._ref.get();
			if (!ref) {
				return reject(new Error('No ref, path or query set on Collection'));
			}
			this._ready(false);
			this._fetching.set(true);
			ref.get().then(
				snapshot => {
					transaction(() => {
						this._fetching.set(false);
						this._updateFromSnapshot(snapshot);
					});
					this._ready(true);
					resolve(this);
				},
				err => {
					this._fetching.set(false);
					this._ready(true);
					reject(err);
				}
			);
		});
	}

	/**
	 * True when a fetch is in progress.
	 *
	 * Fetches are performed in these cases:
	 *
	 * - When real-time updating is started
	 * - When a different `ref` or `path` is set
	 * - When a `query` is set or cleared
	 * - When `fetch` is explicitely called
	 *
	 * @example
	 * const col = new Collection('albums', {mode: 'off'});
	 * console.log(col.fetching);   // fetching: false
	 * col.fetch();                 // start fetch
	 * console.log(col.fetching);   // fetching: true
	 * await col.ready();           // wait for fetch to complete
	 * console.log(col.fetching);   // fetching: false
	 *
	 * @example
	 * const col = new Collection('albums');
	 * console.log(col.fetching);   // fetching: false
	 * const dispose = autorun(() => {
	 *   console.log(col.docs);     // start observing collection data
	 * });
	 * console.log(col.fetching);   // fetching: true
	 * ...
	 * dispose();                   // stop observing collection data
	 * console.log(col.fetching);   // fetching: false
	 */
	get fetching(): boolean {
		return this._fetching.get();
	}

	/**
	 * Promise that is resolved when the Collection has
	 * finished fetching its (initial) documents.
	 *
	 * Use this method to for instance wait for
	 * the initial snapshot update to complete, or to wait
	 * for fresh data after changing the path/ref.
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
	ready(): Promise<void> {
		this._readyPromise = this._readyPromise || Promise.resolve(true);
		return this._readyPromise;
	}

	/**
	 * @private
	 */
	_ready(complete) {
		if (complete) {
			const readyResolve = this._readyResolve;
			if (readyResolve) {
				this._readyResolve = undefined;
				readyResolve(true);
			}
		} else if (!this._readyResolve) {
			this._readyPromise = new Promise(resolve => {
				this._readyResolve = resolve;
			});
		}
	}

	/**
	 * Add a new document to this collection with the specified
	 * data, assigning it a document ID automatically.
	 *
	 * @example
	 * const doc = await collection.add({
	 *   finished: false,
	 *   text: 'New todo',
	 *   options: {
	 *     highPrio: true
	 *   }
	 * });
	 */
	add(data: any): Promise<Document> {
		return new Promise((resolve, reject) => {
			const ref = this.ref;
			if (!ref) throw new Error('No valid collection reference');
			ref.add(data).then(ref => {
				ref.get().then(snapshot => {
					const doc = new this._documentClass(snapshot.ref, {
						snapshot: snapshot
					});
					resolve(doc);
				}, reject);
			}, reject);
		});
	}

	/**
	 * Deletes all the documents in the collection or query.
	 *
	 * TODO - Not implemented yet
	 */
	deleteAll(): Promise<void> {
		const ref = this.ref;
		if (!ref) throw new Error('No valid collection reference');
		// TODO
		return Promise.resolve(undefined);
	}

	/**
	 * Called whenever a property of this class becomes observed.
	 * @private
	 */
	addObserverRef(): number {
		if (this._debug)
			console.debug(
				`${this.debugName} - addRef (${this._observedRefCount + 1})`
			);
		const res = ++this._observedRefCount;
		this._updateRealtimeUpdates();
		return res;
	}

	/**
	 * Called whenever a property of this class becomes un-observed.
	 * @private
	 */
	releaseObserverRef(): number {
		if (this._debug)
			console.debug(
				`${this.debugName} - releaseRef (${this._observedRefCount - 1})`
			);
		const res = --this._observedRefCount;
		this._updateRealtimeUpdates();
		return res;
	}

	/**
	 * @private
	 */
	_onSnapshot(snapshot: QuerySnapshot) {
		transaction(() => {
			if (this._debug) console.debug(`${this.debugName} - onSnapshot`);
			this._fetching.set(false);
			this._updateFromSnapshot(snapshot);
			this._ready(true);
		});
	}

	/**
	 * @private
	 */
	_updateFromSnapshot(snapshot: QuerySnapshot) {
		const newDocs = [];
		snapshot.docs.forEach((snapshot: DocumentSnapshot) => {
			let doc = this._docLookup[snapshot.id];
			try {
				if (doc) {
					doc._updateFromSnapshot(snapshot);
				} else {
					doc = new this._documentClass(snapshot.ref, {
						snapshot: snapshot
					});
					this._docLookup[doc.id] = doc;
				}
				doc._collectionRefCount++;
				newDocs.push(doc);
			} catch (err) {
				console.error(err.message);
			}
		});
		this._docs.forEach(doc => {
			if (!--doc._collectionRefCount) {
				delete this._docLookup[doc.id || ''];
			}
		});

		if (this._docs.length !== newDocs.length) {
			this._docs.replace(newDocs);
		} else {
			for (let i = 0, n = newDocs.length; i < n; i++) {
				if (newDocs[i] !== this._docs[i]) {
					this._docs.replace(newDocs);
					break;
				}
			}
		}
	}

	/**
	 * @private
	 */
	_updateRealtimeUpdates(force?: boolean) {
		let newActive = false;
		switch (this._mode.get()) {
			case 'auto':
				newActive = !!this._observedRefCount;
				break;
			case 'off':
				newActive = false;
				break;
			case 'on':
				newActive = true;
				break;
		}

		// Start/stop listening for snapshot updates
		const ref = this._ref.get();
		if (!ref) {
			newActive = false;
		}
		const active = !!this._onSnapshotUnsubscribe;
		if (newActive && (!active || force)) {
			if (this._debug)
				console.debug(
					`${this.debugName} - ${
						active ? 're-' : ''
					}start (${this._mode.get()}:${this._observedRefCount})`
				);
			this._ready(false);
			this._fetching.set(true);
			if (this._onSnapshotUnsubscribe) this._onSnapshotUnsubscribe();
			this._onSnapshotUnsubscribe = (this._query.get() || ref).onSnapshot(
				snapshot => this._onSnapshot(snapshot)
			);
		} else if (!newActive && active) {
			if (this._debug)
				console.debug(
					`${this.debugName} - stop (${this._mode.get()}:${
						this._observedRefCount
					})`
				);
			this._onSnapshotUnsubscribe();
			this._onSnapshotUnsubscribe = undefined;
			if (this._fetching.get()) {
				this._fetching.set(false);
			}
			this._ready(true);
		}
	}

	/**
	 * @private
	 */
	get debugName(): string {
		return `${this._debugName || this.constructor.name} (${this.path})`;
	}
}

export default Collection;
