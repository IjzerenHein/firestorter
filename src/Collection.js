// @flow
import {observable, transaction} from 'mobx';
import {enhancedObservable} from './enhancedObservable';
import Document from './Document';
import {getFirestore} from './init';
import type {
	DocumentSnapshot,
	CollectionReference,
	Query,
	QuerySnapshot
} from 'firebase/firestore';

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
 * const col2 = new Collection('artists', 'on');
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
	_docLookup: {[string]: Document};
	_ref: DocumentSnapshot;
	_query: DocumentSnapshot;
	_realtimeUpdating: DocumentSnapshot;
	_fetching: DocumentSnapshot;
	_docs: Array<Document>;
	_onSnapshotUnsubscribe: () => void | void;
	_observedRefCount: number;

	constructor(pathOrRef: CollectionReference|string, realtimeUpdating: string = 'auto') {
		this._docLookup = {};
		if (typeof pathOrRef === 'string') {
			pathOrRef = getFirestore().collection(pathOrRef);
		}
		this._onSnapshot = this._onSnapshot.bind(this);
		this._observedRefCount = 0;
		this._ref = observable(pathOrRef);
		this._query = observable(undefined);
		this._realtimeUpdating = observable(realtimeUpdating);
		this._fetching = observable(false);
		this._docs = enhancedObservable([], this);
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
	get ref(): CollectionReference {
		return this._ref.get();
	}
	set ref(ref: CollectionReference) {
		if (this._ref.get() === ref) return;
		this._ref.set(ref);
		if (this._active && !this._query.get()) {
			this._start();
		}
	}

	/**
	 * Id of the Firestore collection (e.g. 'tracks').
	 *
	 * To get the full-path of the collection, use `path`.
	 */
	get id(): string {
		return this.ref.id;
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
	get path(): string {
		let ref = this._ref.get();
		let path = ref.id;
		while (ref.parent) {
			path = ref.parent.id + '/' + path;
			ref = ref.parent;
		}
		return path;
	}
	set path(collectionPath: string) {
		if (this.path === collectionPath) return;
		this.ref = this.ref.firestore.collection(collectionPath);
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
	get query(): Query {
		return this._query.get();
	}
	set query(query?: Query) {
		if (this._query.get() === query) return;
		this._query.set(query);
		if (this._active) {
			this._start();
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
	get realtimeUpdating(): string {
		return this._realtimeUpdating.get();
	}
	set realtimeUpdating(mode: string) {
		if (this._realtimeUpdating.get() === mode) return;
		switch (mode) {
		case 'auto':
		case 'off':
		case 'on':
			break;
		default:
			throw new Error('Invalid realtimeUpdating mode: ' + mode);
		}
		const oldActive = this._active;
		this._realtimeUpdating.set(mode);
		const active = this._active;

		if (!active && oldActive) {
			this._stop();
		}
		else if (active && !oldActive) {
			this._start();
		}
	}

	/**
	 * Fetches new data from firestore. Use this to manually fetch
	 * new data when `realtimeUpdating` is set to 'off'.
	 *
	 * @example
 	 * const col = new Collection('albums', 'off');
 	 * col.fetch().then(({docs}) => {
   *   docs.forEach(doc => console.log(doc));
	 * });
	 */
	fetch(): Promise<Collection> {
		return new Promise((resolve, reject) => {
			if (this._active) return reject(new Error('Should not call fetch when real-time updating is active'));
			this._fetching.set(true);
			const ref = this._query.get() || this._ref.get();
			ref.then((snapshot) => {
				this._fetching.set(false);
				this._updateFromSnapshot(snapshot);
				resolve(this);
			}, (err) => {
				this._fetching.set(false);
				reject(err);
			});
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
	 */
	get fetching(): boolean {
		return this._fetching.get();
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
			this.ref.add(data).then((ref) => {
				ref.get().then((snapshot) => {
					const doc = new Document(snapshot);
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
		// TODO
	}

	/**
	 * Called whenever a property of this class becomes observed.
	 * @private
	 */
	addObserverRef(): number {
		if ((++this._observedRefCount === 1) && (this._realtimeUpdating.get() === 'auto')) {
			this._start();
		}
		return this._observedRefCount;
	}

	/**
	 * Called whenever a property of this class becomes un-observed.
	 * @private
	 */
	releaseObserverRef(): number {
		if ((--this._observedRefCount === 0) && (this._realtimeUpdating.get() === 'auto')) {
			this._stop();
		}
		return this._observedRefCount;
	}

	/**
	 * @private
	 */
	_start(): void {
		console.log('onStart');
		if (this._onSnapshotUnsubscribe) this._onSnapshotUnsubscribe();
		if (this._query.get()) {
			this._fetching.set(true);
			this._onSnapshotUnsubscribe = this._query.get().onSnapshot(this._onSnapshot);
		}
		else if (this._ref.get()) {
			this._fetching.set(true);
			this._onSnapshotUnsubscribe = this._ref.get().onSnapshot(this._onSnapshot);
		}
		else {
			this._onSnapshotUnsubscribe = undefined;
		}
	}

	/**
	 * @private
	 */
	_stop(): void {
		console.log('onStop');
		if (this._onSnapshotUnsubscribe) {
			this._onSnapshotUnsubscribe();
			this._onSnapshotUnsubscribe = undefined;
		}
		if (this._fetching.get()) {
			this._fetching.set(false);
		}
	}

	/**
	 * @private
	 */
	get _active(): boolean {
		switch (this._realtimeUpdating.get()) {
		case 'off': return false;
		case 'auto': return (this._observedRefCount >= 1);
		case 'on': return true;
		default: return false;
		}
	}

	/**
	 * @private
	 */
	_onSnapshot(snapshot: QuerySnapshot) {
		transaction(() => {
			this._fetching.set(false);
			this._updateFromSnapshot(snapshot);
		});
	}

	/**
	 * @private
	 */
	_updateFromSnapshot(snapshot: QuerySnapshot) {
		const newDocs = snapshot.docs.map((snapshot) => {
			let doc = this._docLookup[snapshot.id];
			if (doc) {
				doc.snapshot = snapshot;
			}
			else {
				doc = new Document(snapshot);
				this._docLookup[doc.id] = doc;
			}
			doc.addCollectionRef();
			return doc;
		});
		this._docs.forEach((doc) => {
			if (!doc.releaseCollectionRef()) {
				delete this._docLookup[doc.id];
			}
		});

		if (this._docs.length !== newDocs.length) {
			this._docs.replace(newDocs);
		}
		else {
			for (let i = 0, n = newDocs.length; i < n; i++) {
				if (newDocs[i] !== this._docs[i]) {
					this._docs.replace(newDocs);
					break;
				}
			}
		}
	}
}

export default Collection;
