import Query from './Query';

class Collection extends Query {

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
	 * Deletes the collection by deleting all contained
	 * documents in it.
	 *
	 * @return {Promise} Number of documents deleted
	 */
	delete() {
		// TODO
	}
}

export default Collection;
