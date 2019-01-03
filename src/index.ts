import Collection from "./Collection";
import Document from "./Document";
import { Mode } from "./Types";
import {
	getFirebase,
	getFirebaseApp,
	getFirestore,
	initFirestorter,
	makeContext,
	IContext,
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
	Mode,
	isTimestamp,
	makeContext,
	IContext,
};
