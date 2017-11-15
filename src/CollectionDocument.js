// @flow
import DocumentData from './DocumentData';
import type {
	DocumentSnapshot,
} from 'firebase/firestore';

/**
 * @private
 */
class CollectionDocument extends DocumentData {
	_collectionRefCount: number;

	constructor(snapshot: DocumentSnapshot) {
		super(snapshot.ref, snapshot);
		this._collectionRefCount = 0;
	}

	_addCollectionRef(): number {
		return ++this._collectionRefCount;
	}

	_releaseCollectionRef(): number {
		return --this._collectionRefCount;
	}
}

export default CollectionDocument;
