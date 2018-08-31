// @flow
import { initFirestorter, getFirestore, getFirebase, getFirebaseApp } from './init';
import Collection from './Collection';
import Document from './Document';

export { Collection, Document, initFirestorter, getFirestore, getFirebase, getFirebaseApp };

export default {
	Collection,
	Document,
	initFirestorter,
	getFirestore,
	getFirebase,
	getFirebaseApp
};
