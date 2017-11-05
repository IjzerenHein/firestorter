// @flow
import {observable} from 'mobx';
import Document from './Document';
import DocumentStore from './DocumentStore';
import {getFirestore} from './firebaseApp';
import type {
	DocumentSnapshot,
	CollectionReference,
	Query,
	QuerySnapshot
} from 'firebase/firestore';

/**
 * The Collection class lays at the heart of `react-firestore-mobx`.
 * It represents a collection in Firestore and its queried data. It is
 * observable so that it can be efficiently linked to a React Component
 * using `mobx-react`'s `observer`.
 *
 * A Collection can operate in two modes:
 * - real-time updates enabled
 * - real-time updates disabled
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
 * // Create a collection using path (preferred)
 * const col = new Collection('artists/Metallica/albums');
 *
 * // Create a collection using a reference
 * const col2 = new Collection(firebase.firestore().collection('todos'));
 *
 * // Create a collection and immediately start it
 * const col2 = new Collection('artists').start();
 *
 * // Create a collection and set a query on it
 * const col3 = new Collection('artists');
 * col3.query = col3.ref.orderBy('name', 'asc');
 * col3.start();
 *
 * @example
 * // To start real-time updates, use
 * collection.start();
 *
 * // Or to create a collection and immediately start it, use
 * const col = new Collection('albums/black/tracks').start();
 *
 * // And to stop it
 * collection.stop();
 *
 * // You can check whether real-time updates are enabled like this
 * console.log(collection.realtimeUpdatesEnabled);
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
	_docStore: DocumentStore;
	_ref: DocumentSnapshot;
	_query: DocumentSnapshot;
	_realtime: DocumentSnapshot;
	_fetching: DocumentSnapshot;
	_docs: Array<Document>;
	_onSnapshotUnsubscribe: () => void | void;

	constructor(ref: CollectionReference|string) {
		this._docStore = new DocumentStore();
		if (typeof ref === 'string') {
			ref = getFirestore().collection(ref);
		}
		this._ref = observable(ref);
		this._query = observable(undefined);
		this._realtime = observable(false);
		this._fetching = observable(false);
		this._docs = observable([]);
		this._onSnapshot = this._onSnapshot.bind(this);
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
		if (!this._realtime.get()) return;
		if (!this._query.get()) {
			if (this._onSnapshotUnsubscribe) this._onSnapshotUnsubscribe();
			this._fetching.set(true);
			this._onSnapshotUnsubscribe = ref.onSnapshot(this._onSnapshot);
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
		if (!this._realtime.get()) return;
		if (this._onSnapshotUnsubscribe) {
			this._onSnapshotUnsubscribe();
			this._onSnapshotUnsubscribe = undefined;
		}
		if (query) {
			this._fetching.set(true);
			this._onSnapshotUnsubscribe = query.onSnapshot(this._onSnapshot);
		}
		else if (this._ref.get()) {
			this._fetching.set(true);
			this._onSnapshotUnsubscribe = this._ref.get().onSnapshot(this._onSnapshot);
		}
	}

	/**
	 * Starts real-time updating.
	 *
	 * @return {Collection} This collection so it can be chained.
	 */
	start(): Collection {
		if (this._realtime.get()) return this;
		if (this._onSnapshotUnsubscribe) this._onSnapshotUnsubscribe();
		this._fetching.set(true);
		if (this._query.get()) {
			this._onSnapshotUnsubscribe = this._query.get().onSnapshot(this._onSnapshot);
		}
		else {
			this._onSnapshotUnsubscribe = this._ref.get().onSnapshot(this._onSnapshot);
		}
		this._realtime.set(true);
		return this;
	}

	/**
	 * Stops real-time updating.
	 *
	 * @return {Collection} This collection so it can be chained.
	 */
	stop(): Collection {
		if (!this._realtime.get()) return this;
		if (this._onSnapshotUnsubscribe) {
			this._onSnapshotUnsubscribe();
			this._onSnapshotUnsubscribe = undefined;
		}
		this._realtime.set(false);
		return this;
	}

	/**
	 * True when the firestore back-end is being monitored
	 * for real-time updates.
	 */
	get realtimeUpdatesEnabled(): boolean {
		return this._realtime.get();
	}

	/**
	 * Fetches new data from firestore. Use this to manually fetch
	 * new data when `realtimeUpdatingEnabled` is False.
	 *
	 * @example
 	 * const col = new Collection('albums');
 	 * col.fetch().then(({docs}) => {
   *   docs.forEach(doc => console.log(doc));
	 * });
	 */
	fetch(): Promise<Collection> {
		return new Promise((resolve, reject) => {
			if (this._realtime.get()) return reject(new Error('Should not call fetch when real-time updates are enabled'));
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
					const doc = Document.create(snapshot);
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
	 * @private
	 */
	_onSnapshot(snapshot: QuerySnapshot) {
		this._fetching.set(false);
		this._updateFromSnapshot(snapshot);
	}

	/**
	 * @private
	 */
	_updateFromSnapshot(snapshot: QuerySnapshot) {
		const newDocs = snapshot.docs.map((snapshot) => {
			let doc = this._docStore.getAndAddRef(snapshot.id);
			if (doc) {
				doc.snapshot = snapshot;
			}
			else {
				doc = this._docStore.add(Document.create(snapshot));
			}
			return doc;
		});
		this._docStore.releaseRefs(this._docs);

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
