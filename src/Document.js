// @flow
import {observable} from 'mobx';
import type {
	DocumentSnapshot,
	DocumentReference
} from 'firebase/firestore';

/**
 * Document represents a document stored in the firestore
 * no-sql database. It is initialized with a firestore `DocumentSnapshot`
 * object so that it immediately has data. The properties are MobX
 * observerables to enable fine grained efficient re-rendering of
 * components.
 *
 * Documents are typically created by the `Collection` class but can also
 * be explicitly created using the constructor or `Document.create`.
*/
class Document {
	_snapshot: DocumentSnapshot;
	_createTime: DocumentSnapshot;
	_updateTime: DocumentSnapshot;
	_readTime: DocumentSnapshot;
	_data: DocumentSnapshot;
	_refCount: number;

	constructor(snapshot: DocumentSnapshot) {
		this._snapshot = snapshot;
		this._createTime = observable(snapshot.createTime);
		this._updateTime = observable(snapshot.updateTime);
		this._readTime = observable(snapshot.readTime);
		this._data = observable(snapshot.data());
		this._refCount = 1;
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
		return this._data;
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
		this._snapshot = snapshot;
		this._createTime.set(snapshot.createTime);
		this._updateTime.set(snapshot.updateTime);
		this._readTime.set(snapshot.readTime);

		const data = snapshot.data();
		for (const key in data) {
			this._data[key] = data[key];
		}
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
	 * Overidable method that is called whenever the document
	 * is no longer referenced. Can be used to perform optional
	 * cleanup.
	 */
	onFinalRelease() {
		// Override to implement
	}

	/**
	 * Creates a new Document.
	 *
	 * @param {DocumentSnapshot} snapshot - Snapshot of the document
	 */
	static create(snapshot: DocumentSnapshot): Document {
		return new Document(snapshot);
	}
}

export default Document;
