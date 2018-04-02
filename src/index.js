// @flow
import { initFirestorter, getFirestore } from './init';
import Collection from './Collection';
import Query from './Query';
import Document from './Document';

export { Collection, Query, Document, initFirestorter, getFirestore };

export default {
	Collection,
	Query,
	Document,
	initFirestorter,
	getFirestore
};
