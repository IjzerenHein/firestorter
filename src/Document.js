import {observable} from 'mobx';

class Document {

	constructor(snapshot) {
		this._snapshot = snapshot;
		this._createTime = observable(snapshot.createTime);
		this._updateTime = observable(snapshot.updateTime);
		this._readTime = observable(snapshot.readTime);
		this._data = observable(snapshot.data());
	}

	static create(snapshot) {
		return new Document(snapshot);
	}

	// TODO - realtime?

	/**
	 * Firestore document reference.
	 * @readonly
	 * @type {DocumentReference}
	 */
	get ref() {
		return this._snapshot.ref;
	}
	
	/**
	 * Underlying firestore snapshot.
	 * @type {DocumentSnapshot}
	 */
	get snapshot() {
		return this._snapshot;
	}
	set snapshot(snapshot) {
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
	 * Id of the Firestore document.
	 * @readonly
	 * @type {String}
	 */
	get id() {
		return this._snapshot.ref.id;
	}

	/**
	 * Data inside the Firestore document.
	 * @type {Object}
	 */
	get data() {
		return this._data;
	}
	set data(data) {
		// TODO
	}

	/**
	 * Time the document was created in firestore.
	 * @readonly
	 * @type {String}
	 */
	get createTime() {
		return this._readTime.get();
	}

	/**
	 * Time the document was last updated in firestore.
	 * @readonly
	 * @type {String}
	 */
	get updateTime() {
		return this._updateTime.get();
	}

	/**
	 * Time this document was last read from firestore.
	 * @readonly
	 * @type {String}
	 */
	get readTime() {
		return this._readTime.get();
	}

	/**
	 * Updates one or more fields in the document.
	 *
	 * @return {Promise}
	 */
	update(fields) {
		return this.ref.update(fields);
	}

	/**
	 * Deletes the document in Firestore from its parent collection.
	 *
	 * @return {Promise}
	 */
	delete() {
		return this.ref.delete();
	}
}

export default Document;
