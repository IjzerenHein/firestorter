import Collection from "./Collection";
import Document from "./Document";
import {
	getFirebase,
	getFirebaseApp,
	getFirestore,
	initFirestorter
} from "./init";
import { mergeUpdateData, isTimestamp } from "./Utils";

export {
	Collection,
	Document,
	initFirestorter,
	getFirestore,
	getFirebase,
	getFirebaseApp,
	mergeUpdateData,
	isTimestamp
};
