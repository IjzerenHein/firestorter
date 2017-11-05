// @flow
import {observable} from 'mobx';
import Document from './Document';
import DocumentStore from './DocumentStore';
import type {
	DocumentSnapshot,
	CollectionReference,
	Query,
	QuerySnapshot
} from 'firebase/firestore';

/**
 * This class implements the base functionality
 * for a bluetooth connection. You typically don't instantiate this
 * class explicitely, but instead derive a class from it which
 * implements a specific connection (e.g. WebBluetoothComms).
*/
class Collection {
	_docStore: DocumentStore;
	_ref: DocumentSnapshot;
	_query: DocumentSnapshot;
	_realtime: DocumentSnapshot;
	_fetching: DocumentSnapshot;
	_docs: Array<Document>;
	_onSnapshotUnsubscribe: () => void | void;

	constructor(ref: CollectionReference, query: Query) {
		this._docStore = new DocumentStore();
		this._ref = observable(ref);
		this._query = observable(query);
		this._realtime = observable(false);
		this._fetching = observable(false);
		this._docs = observable([]);
		this._onSnapshot = this._onSnapshot.bind(this);
	}

	/**
	 * Array of all the documents that have been fetched
	 * from firestore.
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
	 * Firestore query.
	 *
	 * Use this property to set any order-by, where,
	 * limit or start/end criteria. When set, the query
	 * is used to retrieve any data. When cleared, the collection
	 * reference is used.
	 *
	 * @example
	 * todos.query = todos.ref.where('finished', '==', false).orderBy('asc').limit(20);
	 */
	get query(): Query {
		return this._query.get();
	}
	set query(query: Query) {
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
	 * True when the firestore is monitored for real-time updates
	 * @property
	 * @type {bool}
	 */
	get realtime(): boolean {
		return this._realtime.get();
	}
	set realtime(realtime: boolean) {
		if (this._realtime.get() === realtime) return;
		if (this._onSnapshotUnsubscribe) {
			this._onSnapshotUnsubscribe();
			this._onSnapshotUnsubscribe = undefined;
		}
		if (realtime) {
			this._fetching.set(true);
			this._onSnapshotUnsubscribe = this._ref.get().onSnapshot(this._onSnapshot);
		}
		this._realtime.set(realtime);
	}

	/**
	 * Enables realtime updating and returns this object.
	 *
	 * @return {Collection} This collection
	 */
	start(): Collection {
		this.realtime = true;
		return this;
	}

	/**
	 * Stops realtime updating and returns this object.
	 *
	 * @return {Collection} This collection
	 */
	stop(): Collection {
		this.realtime = false;
		return this;
	}

	/**
	 * Fetches new data from firestore. Use this to manualle fetch
	 * new data when `realtime` is disabled.
	 *
	 * @return {Promise} This collection
	 */
	fetch(): Promise<Collection> {
		this._fetching.set(true);
		return new Promise((resolve, reject) => {
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
	 * True when a fetch is in progress
	 */
	get fetching(): boolean {
		return this._fetching.get();
	}

	/**
	 * Add a new document to this collection with the specified
	 * data, assigning it a document ID automatically.
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
	 * @return {Promise} Number of documents deleted
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
