import { app, firestore } from "firebase";
import * as firebaseT from "firebase";

export const ModuleName = 'firestorter';

export interface IContext {
	readonly firebase: typeof firebaseT;
	readonly app: app.App;
	readonly firestore: firestore.Firestore;
}

export interface IHasContext {
	readonly context?: IContext;
}

let globalContext: IContext;

/**
 * Initializes `firestorter` with the firebase-app.
 *
 * @param {Object} config - Configuration options
 * @param {Firebase} config.firebase - Firebase reference
 * @param {String|FirebaseApp} [config.app] - FirebaseApp to use (when omitted the default app is used)
 *
 * @example
 * import firebase from 'firebase';
 * import 'firebase/firestore';
 * import {initFirestorter, Collection, Document} from 'firestorter';
 *
 * // Initialize firebase app
 * firebase.initializeApp({...});
 *
 * // Initialize `firestorter`
 * initFirestorter({firebase: firebase});
 *
 * // Create collection or document
 * const albums = new Collection('artists/Metallica/albums');
 * ...
 * const album = new Document('artists/Metallica/albums/BlackAlbum');
 * ...
 */
function initFirestorter(config: {
	firebase: typeof firebaseT;
	app?: string | app.App;
}): void {
	if (globalContext) {
		throw new Error(
			"Firestorter already initialized, did you accidentally call `initFirestorter()` again?"
		);
	}

	// Set firebase object
	if (!config.firebase) {
		throw new Error(
			"Missing argument `firebase` specified to `initFirestorter()`"
		);
	}
	const globalFirebase = config.firebase;

	// Get app instance
	const globalFirebaseApp = config.app
		? typeof config.app === "string"
			? globalFirebase.app(config.app)
			: config.app
		: globalFirebase.app();

	// Get firestore instance
	const globalFirestore = globalFirebaseApp.firestore();
	if (!globalFirestore) {
		throw new Error(
			"firebase.firestore() returned `undefined`, did you forget `import 'firebase/firestore';`"
		);
	}

	// Verify existence of firestore & fieldvalue
	try {
		globalFirebase.firestore.FieldValue.delete();
	} catch (err) {
		throw new Error(
			"invalid `firebase` argument specified to `initFirestorter()`, `firebase.firestore.FieldValue.delete` does not exist"
		);
	}

	globalContext = {
		app: globalFirebaseApp,
		firebase: globalFirebase,
		firestore: globalFirestore,
	}
}

function getContext(obj?: IHasContext): IContext {
	if (obj && obj.context) {
		return obj.context
	}

	if (globalContext) {
		return globalContext
	}

	if (obj) {
		throw new Error(`No context for ${obj} or globally. Did you forget to call \`initFirestorter\` or pass {context: ...} option?`)
	}

	throw new Error(
		`No global Firestore context. Did you forget to call \`initFirestorter\` ?`
	)
}

function contextWithProperty(key: keyof IContext, obj?: IHasContext) {
	try {
		const context = getContext(obj)
		if (context[key]) { return context }
		throw new Error(`Context does not contain ${key}`)
	} catch(err) {
		throw new Error(`${ModuleName}: cannot get ${key}: ${err}`)
	}
}

function getFirebase(obj?: IHasContext): typeof firebaseT {
	return contextWithProperty('firebase', obj).firebase
}

function getFirebaseApp(obj?: IHasContext): app.App {
	return contextWithProperty('app', obj).app
}

function getFirestore(obj?: IHasContext): firestore.Firestore {
	return contextWithProperty('firestore', obj).firestore
}

export { initFirestorter, getFirestore, getFirebase, getFirebaseApp };
