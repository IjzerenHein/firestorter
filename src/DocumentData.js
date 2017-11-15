// @flow
import {observable} from 'mobx';
import {enhancedObservable} from './enhancedObservable';
import isEqual from 'lodash.isequal';
import type {
	DocumentSnapshot,
	DocumentReference
} from 'firebase/firestore';

/**
 * DocumentData is the base class for Document and implements the data-storage
 * part of a document. You should not instantiate this class directly, but instead
 * use the Collection class to obtain document or use the Document class to fetch
 * document data from the back-end.
*/
class DocumentData {
	_ref: DocumentSnapshot;
	_snapshot: DocumentSnapshot;
	_observedRefCount: number;
	_createTime: DocumentSnapshot;
	_updateTime: DocumentSnapshot;
	_readTime: DocumentSnapshot;
	_data: DocumentSnapshot;

	constructor(ref: DocumentReference, snapshot: DocumentSnapshot) {
		this._ref = observable(ref);
		this._snapshot = observable(snapshot);
		this._observedRefCount = 0;
		this._createTime = enhancedObservable(snapshot ? snapshot.createTime : '', this);
		this._updateTime = enhancedObservable(snapshot ? snapshot.updateTime : '', this);
		this._readTime = enhancedObservable(snapshot ? snapshot.readTime : '', this);
		this._data = enhancedObservable(snapshot ? snapshot.data() : {}, this);
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
		return this._ref.get();
	}

	/**
	 * Id of the firestore document.
	 *
	 * To get the full-path of the document, use `path`.
	 */
	get id(): string {
		return this._ref.get().id;
	}

	/**
	 * Path of the document (e.g. 'albums/blackAlbum').
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

	/**
	 * Underlying firestore snapshot.
	 */
	get snapshot(): DocumentSnapshot {
		return this._snapshot.get();
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
		return this._ref.get().update(fields);
	}

	/**
	 * Deletes the document in Firestore.
	 *
	 * Returns a promise that resolves once the document has been
	 * successfully deleted from the backend (Note that it won't
	 * resolve while you're offline).
	 */
	delete(): Promise<void> {
		return this._ref.get().delete();
	}

	/**
	 * Called whenever a property of this class becomes observed.
	 * @private
	 */
	addObserverRef(): number {
		return ++this._observedRefCount;
	}

	/**
	 * Called whenever a property of this class becomes un-observed.
	 * @private
	 */
	releaseObserverRef(): number {
		return --this._observedRefCount;
	}

	/**
	 * @private
	 */
	_updateFromSnapshot(snapshot: DocumentSnapshot) {
		this._snapshot.set(snapshot);
		this._createTime.set(snapshot.createTime);
		this._updateTime.set(snapshot.updateTime);
		this._readTime.set(snapshot.readTime);

		const data = snapshot.data();
		if (!isEqual(data, this._data.get())) {
			this._data.set(data);
		}

		/* for (const key in data) {
			this._data[key] = data[key];
		}*/
	}
}

export default DocumentData;
