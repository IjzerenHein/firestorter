// @flow
import { initFirestorter, getFirestore, getFirebase, getFirebaseApp } from './init';
import Collection from './Collection';
import Document from './Document';
import Batch from './Batch';

export { Collection, Document, Batch, initFirestorter, getFirestore, getFirebase, getFirebaseApp };

export default {
	Collection,
	Document,
	Batch,
	initFirestorter,
	getFirestore,
	getFirebase,
	getFirebaseApp
};
