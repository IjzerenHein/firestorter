// @flow
import {observable, transaction} from 'mobx';
import DocumentData from './DocumentData';
import {getFirestore} from './init';
import type {
	DocumentSnapshot,
	DocumentReference
} from 'firebase/firestore';

/**
 * Document represents a document stored in the firestore no-sql database.
 * Document is observable so that it can be efficiently linked to a React
 * Component using `mobx-react`'s `observer` pattern. This ensures that a
 * component is only re-rendered when data that is accessed in the `render`
 * function has changed.
*/
class Document extends DocumentData {
	_realtimeUpdating: DocumentSnapshot;
	_fetching: DocumentSnapshot;
	_onSnapshotUnsubscribe: () => void | void;

	constructor(
		pathOrRef: DocumentReference|string,
		realtimeUpdating: string = 'auto',
		snapshot?: DocumentSnapshot
	) {
		const ref = (typeof pathOrRef === 'string') ? getFirestore().collection(pathOrRef) : pathOrRef;
		super(ref, snapshot);
		this._onSnapshot = this._onSnapshot.bind(this);
		this._realtimeUpdating = observable(realtimeUpdating);
		this._fetching = observable(false);
		if (realtimeUpdating === 'on') this._updateRealtimeUpdates();
	}

	/**
	 * Firestore dcument reference.
	 *
	 * Use this property to get or set the document
	 * reference. When set, a fetch to the new document
	 * is performed.
	 *
	 * Alternatively, you can also use `path` to change the
	 * reference in more a readable way.
	 *
	 * @example
	 * const doc = new Document(firebase.firestore().doc('albums/splinter'));
	 * ...
	 * // Switch to another document
	 * doc.ref = firebase.firestore().doc('albums/americana');
	 */
	set ref(ref: DocumentReference) {
		if (this._ref.get() === ref) return;
		transaction(() => {
			this._ref.set(ref);
			this._updateRealtimeUpdates(true);
		});
	}

	/**
	 * Path of the document (e.g. 'albums/blackAlbum').
	 *
	 * Use this property to switch to another document in
	 * the back-end. Effectively, it is a more compact
	 * and readable way of setting a new ref.
	 *
	 * @example
	 * const doc = new Document('artists/Metallica');
	 * ...
	 * // Switch to another document in the back-end
	 * doc.path = 'artists/EaglesOfDeathMetal';
	 */
	set path(documentPath: string) {
		if (this.path === documentPath) return;
		this.ref = this._ref.get().firestore.doc(documentPath);
	}

	/**
	 * Real-time updating mode.
	 *
	 * Can be set to any of the following values:
	 * - "auto" (enables real-time updating when the document becomes observed)
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
 	 * const col = new Document('albums/splinter', 'off');
 	 * col.fetch().then(({docs}) => {
   *   docs.forEach(doc => console.log(doc));
	 * });
	 */
	fetch(): Promise<Document> {
		return new Promise((resolve, reject) => {
			if (this._active) return reject(new Error('Should not call fetch when real-time updating is active'));
			this._fetching.set(true);
			this._ref.get().get().then((snapshot) => {
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
	_updateRealtimeUpdates(force) {
		let newActive;
		switch (this._realtimeUpdating.get()) {
		case 'auto': newActive = !!this._observedRefCount; break;
		case 'off': newActive = false; break;
		case 'on': newActive = true; break;
		}
		const active = !!this._onSnapshotUnsubscribe;
		if (newActive && (!active || force)) {
			this._fetching.set(true);
			if (this._onSnapshotUnsubscribe) this._onSnapshotUnsubscribe();
			this._onSnapshotUnsubscribe = this._ref.get().onSnapshot(this._onSnapshot);
		}
		else if (!newActive && active) {
			this._onSnapshotUnsubscribe();
			this._onSnapshotUnsubscribe = undefined;
		}
	}
}

export default Document;
