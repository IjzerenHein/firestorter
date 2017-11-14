// @flow
import {observable, transaction} from 'mobx';
import {enhancedObservable} from './enhancedObservable';
import type {
	DocumentSnapshot,
	DocumentReference
} from 'firebase/firestore';

/**
 * Document represents a document stored in the firestore
 * no-sql database. It is initialized with a firestore `DocumentSnapshot`
 * object so that it immediately has data. Document is
 * observable so that it can be efficiently linked to a React Component
 * using `mobx-react`'s `observer` pattern. This ensures that a component
 * is only re-rendered when data that is accessed in the `render` function
 * has changed.
 *
 * Documents are typically created by the `Collection` class but can also
 * be explicitly created using its constructor.
*/
class Document {
	_snapshot: DocumentSnapshot;
	_createTime: DocumentSnapshot;
	_updateTime: DocumentSnapshot;
	_readTime: DocumentSnapshot;
	_data: DocumentSnapshot;
	_realtimeUpdating: DocumentSnapshot;
	_fetching: DocumentSnapshot;
	_onSnapshotUnsubscribe: () => void | void;
	_observedRefCount: number;
	_collectionRefCount: number;

	constructor(snapshot: DocumentSnapshot) {
		this._onSnapshot = this._onSnapshot.bind(this);
		this._snapshot = snapshot;
		this._createTime = enhancedObservable(snapshot.createTime, this);
		this._updateTime = enhancedObservable(snapshot.updateTime, this);
		this._readTime = enhancedObservable(snapshot.readTime, this);
		this._data = enhancedObservable(snapshot.data(), this);
		this._realtimeUpdating = observable('auto');
		this._fetching = observable(false);
		this._observedRefCount = 0;
		this._collectionRefCount = 0;
	}

	/**
	 * Returns the data inside the firestore document.
	 *
	 * @example
	 * const docData = todos.docs.map((doc) => {
   *	console.log(doc.data);
   *  // {
   *  //   finished: false
   *  //   text: 'Must do this'
   *  // }
	 * });
	 */
	get data(): any {
		return this._data.get();
	}

	/**
	 * Firestore document reference.
	 */
	get ref(): DocumentReference {
		return this._snapshot.ref;
	}

	/**
	 * Id of the firestore document.
	 *
	 * To get the full-path of the document, use `path`.
	 */
	get id(): string {
		return this._snapshot.ref.id;
	}

	/**
	 * Path of the document (e.g. 'albums/blackAlbum').
	 */
	get path(): string {
		let ref = this._snapshot.ref;
		let path = ref.id;
		while (ref.parent) {
			path = ref.parent.id + '/' + path;
			ref = ref.parent;
		}
		return path;
	}

	/**
	 * Underlying firestore snapshot.
	 *
	 * This property can be used to update the data
	 * in the Document. It is for instance used by
	 * the Collection class to update the document when an
	 * update is received from the back-end.
	 */
	get snapshot(): DocumentSnapshot {
		return this._snapshot;
	}
	set snapshot(snapshot: DocumentSnapshot) {
		transaction(() => {
			this._updateFromSnapshot(snapshot);
		});
	}

	/**
	 * Time the document was created in firestore.
	 */
	get createTime(): string {
		return this._readTime.get();
	}

	/**
	 * Time the document was last updated in firestore.
	 */
	get updateTime(): string {
		return this._updateTime.get();
	}

	/**
	 * Time this document was last read from firestore.
	 */
	get readTime(): string {
		return this._readTime.get();
	}


	/**
	 * Real-time updating mode.
	 *
	 * Can be set to any of the following values:
	 * - "auto" (enables real-time updating when the document is observed)
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
		transaction(() => {
			this._realtimeUpdating.set(mode);
			this._updateRealtimeUpdates();
		});
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
	fetch(): Promise<Document> {
		return new Promise((resolve, reject) => {
			if (this._active) return reject(new Error('Should not call fetch when real-time updating is active'));
			this._fetching.set(true);
			this.ref.get().then((snapshot) => {
				transaction(() => {
					this._fetching.set(false);
					this._updateFromSnapshot(snapshot);
				});
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
	 * Updates one or more fields in the document.
	 *
	 * The update will fail if applied to a document that does
	 * not exist.
	 *
	 * @example
	 * await todoDoc.update({
   *	 finished: true,
   *   text: 'O yeah, checked this one off',
   *   foo: {
	 *     bar: 10
   *   }
	 * });
	 */
	update(fields: any): Promise<void> {
		return this.ref.update(fields);
	}

	/**
	 * Deletes the document in Firestore.
	 *
	 * Returns a promise that resolves once the document has been
	 * successfully deleted from the backend (Note that it won't
	 * resolve while you're offline).
	 */
	delete(): Promise<void> {
		return this.ref.delete();
	}

	/**
	 * Called whenever a property of this class becomes observed.
	 * @private
	 */
	addObserverRef(): number {
		const res = ++this._observedRefCount;
		this._updateRealtimeUpdates();
		return res;
	}

	/**
	 * Called whenever a property of this class becomes un-observed.
	 * @private
	 */
	releaseObserverRef(): number {
		const res = --this._observedRefCount;
		this._updateRealtimeUpdates();
		return res;
	}

	/**
	 * Called whenever the parent collection adds an in-use reference
	 * to this document.
	 * @private
	 */
	addCollectionRef(): number {
		const res = ++this._collectionRefCount;
		this._updateRealtimeUpdates();
		return res;
	}

	/**
	 * Called whenever the parent collection removed an in-use reference
	 * to this document. Whenever the collection reference reaches 0
	 * then it is no longer owned by the collection and therefore no
	 * longer updated by it.
	 * @private
	 */
	releaseCollectionRef(): number {
		const res = --this._collectionRefCount;
		this._updateRealtimeUpdates();
		return res;
	}

	/**
	 * @private
	 */
	_onSnapshot(snapshot: DocumentSnapshot) {
		transaction(() => {
			this._fetching.set(false);
			this._updateFromSnapshot(snapshot);
		});
	}

	/**
	 * @private
	 */
	_updateFromSnapshot(snapshot: DocumentSnapshot) {
		this._snapshot = snapshot;
		this._createTime.set(snapshot.createTime);
		this._updateTime.set(snapshot.updateTime);
		this._readTime.set(snapshot.readTime);

		const data = snapshot.data();
		this._data.set(data);

		/* for (const key in data) {
			this._data[key] = data[key];
		}*/
	}

	/**
	 * @private
	 */
	_updateRealtimeUpdates() {
		let newActive;
		switch (this._realtimeUpdating.get()) {
		case 'auto': newActive = !this._collectionRefCount && this._observedRefCount; break;
		case 'off': newActive = false; break;
		case 'on': newActive = true; break;
		}
		const active = !!this._onSnapshotUnsubscribe;
		if (newActive && !active) {
			// Disabled for now, not yet working...
			// this._fetching.set(true);
			// this._onSnapshotUnsubscribe = this.ref.onSnapshot(this._onSnapshot);
		}
		else if (!newActive && active) {
			this._onSnapshotUnsubscribe();
			this._onSnapshotUnsubscribe = undefined;
		}
	}
}

export default Document;
