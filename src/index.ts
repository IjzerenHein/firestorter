import Collection from "./Collection";
import Document from "./Document";
import { Mode } from "./Utils";
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
	Mode,
	mergeUpdateData
};

export default {
	Collection,
	Document,
	Mode,
	getFirebase,
	getFirebaseApp,
	getFirestore,
	initFirestorter,
	mergeUpdateData
};
