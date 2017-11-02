import {observable} from 'mobx';
import Document from './Document';

class Query {
	constructor(ref, realtime, docFactoryFn) {
		this._ref = ref;
		this._createDocFn = docFactoryFn || Document.create;
		this._realtime = observable(false);
		this._fetching = observable(false);
		this._docs = observable([]);
		this._onSnapshot = this._onSnapshot.bind(this);
		if (realtime) this.realtime = true;
	}

	get docs() {
		return this._docs;
	}

	/**
	 * Firestore query reference.
	 * @type {QueryReference|CollectionReference}
	 */
	get ref() {
		return this._ref;
	}
	set ref(ref) {
		if (this._ref === ref) return;
		this._ref = ref;
		if (!this._realtime.get()) return;
		if (this._onSnapshotUnsubscribe) {
			this._onSnapshotUnsubscribe();
		}
		this._onSnapshotUnsubscribe = this._ref.onSnapshot(this._onSnapshot);
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
			this._onSnapshotUnsubscribe = this._ref.onSnapshot(this._onSnapshot);
		}
		this._realtime.set(realtime);
	}

	/**
	 * Fetches new data from firestore. Use this when `realtime`
	 * updates are disabled, to manually fetch new data.
	 *
	 * @return {Promise} this query
	 */
	async fetch() {
		this._fetching.set(true);
		try {
			const snapshot = await this._ref.get();
			this._fetching.set(false);
			this._updateFromSnapshot(snapshot);
			return this;
		}
		catch (err) {
			this._fetching.set(false);
			throw err;
		}
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
		const docs = snapshot.docs;
		const oldArray = this._docs.slice(0);
		const newArray = []; 

		for (let i = 0, n = docs.length; i < n; i++) {
			const docSnapshot = docs[i];

			// Find existing document and re-use that when possible
			let doc;
			for (let j = 0; j < oldArray.length; j++) {
				const oldDoc = oldArray[j];
				if (oldDoc.id === docSnapshot.id) {
					doc = oldDoc;
					oldArray.splice(j, 1);
					break;
				}
			}

			// Create/update document
			if (!doc) {
				doc = this._createDocFn(docSnapshot);
			}
			else {
				doc.snapshot = docSnapshot;
			}
			newArray.push(doc);
		}

		// TODO, stop monitoring old stuff?

		if (this._docs.length !== newArray.length) {
			this._docs.replace(newArray);	
		}
		else {
			for (let i = 0, n = newArray.length; i < n; i++) {
				if (newArray[i] !== this._docs[i]) {
					this._docs.replace(newArray);
					break;
				}
			}
		}	
	}
}

export default Query;
