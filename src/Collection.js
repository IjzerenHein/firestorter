import {observable} from 'mobx';
import Document from './Document';
import DocumentStore from './DocumentStore';

class Collection {
	constructor(ref, query) {
		this._docStore = new DocumentStore();
		this._createDocFn = Document.create;
		this._ref = observable(ref);
		this._query = observable(query);
		this._realtime = observable(false);
		this._fetching = observable(false);
		this._docs = observable([]);
		this._onSnapshot = this._onSnapshot.bind(this);
	}

	/**
	 * Array of documents.
	 * @readonly
	 * @type Array(Document)
	 */
	get docs() {
		return this._docs;
	}

	/**
	 * Firestore collection reference.
	 * @type {CollectionReference}
	 */
	get ref() {
		return this._ref.get();
	}
	set ref(ref) {
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
	 * @type {Query}
	 */
	get query() {
		return this._query.get();
	}
	set query(query) {
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
	get realtime() {
		return this._realtime.get();
	}
	set realtime(realtime) {
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
	start() {
		this.realtime = true;
		return this;
	}

	/**
	 * Stops realtime updating and returns this object.
	 *
	 * @return {Collection} This collection
	 */
	stop() {
		this.realtime = false;
		return this;
	}

	/**
	 * Fetches new data from firestore. Use this to manualle fetch
	 * new data when `realtime` is disabled.
	 *
	 * @return {Promise} this query
	 */
	fetch() {
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
	 * @property
	 * @type {bool}
	 */
	get fetching() {
		return this._fetching.get();
	}

	/**
	 * Add a new document to this collection with the specified
	 * data, assigning it a document ID automatically.
	 *
	 * @param {Object} data
	 * @return {Promise} Promise to Document object
	 */
	add(data) {
		return new Promise((resolve, reject) => {
			this.ref.add(data).then((ref) => {
				ref.get().then((snapshot) => {
					const doc = this._createDocFn(snapshot);
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
	deleteAll() {
		// TODO
	}

	/**
	 * @private
	 */
	_onSnapshot(snapshot) {
		this._fetching.set(false);
		this._updateFromSnapshot(snapshot);
	}

	/**
	 * @private
	 */
	_updateFromSnapshot(snapshot) {
		const newDocs = snapshot.docs.map((snapshot) => {
			let doc = this._docStore.getAndAddRef(snapshot.id);
			if (doc) {
				doc.snapshot = snapshot;
			}
			else {
				doc = this._docStore.add(this._createDocFn(snapshot));
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
