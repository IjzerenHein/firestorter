import Collection from "./Collection";
import Document from "./Document";
import {
	getFirebase,
	getFirebaseApp,
	getFirestore,
	initFirestorter
} from "./init";
import { mergeUpdateData } from "./Utils";

export {
	Collection,
	Document,
	initFirestorter,
	getFirestore,
	getFirebase,
	getFirebaseApp,
	mergeUpdateData
};

export default {
	Collection,
	Document,
	getFirebase,
	getFirebaseApp,
	getFirestore,
	initFirestorter,
	mergeUpdateData
};
