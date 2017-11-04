/**
 * The DocumentStore stores a reference to all in-use documents.
 * It enables recycling of Documents so that a fetch doesn't create
 * new documents, but instead uses the existing ones. This is
 * important to ensure that no unneccesary rendering is performed.
 */
class DocumentStore {

	constructor() {
		this._docs = {};
	}

	add(doc) {
		if (this._docs[doc.id]) throw new Error('Document is already in DocumentStore: ' + doc.id);
		this._docs[doc.id] = doc;
		return doc;
	}

	releaseRefs(docs) {
		docs.forEach((doc) => {
			doc._refCount--;
			if (!doc._refCount) {
				doc.onFinalRelease();
				delete this._docs[doc.id];
			}
		});
	}

	getAndAddRef(id) {
		const doc = this._docs[id];
		if (doc) doc._refCount++;
		return doc;
	}
}

export default DocumentStore;
