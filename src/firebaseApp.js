// @flow
import type Firebase from 'firebase';

// let globalFirebase = undefined;
let globalFirestore;

/**
 * Initializes `firestorter` with the firebase-app.
 *
 * @example
 * import firebase from 'firebase';
 * import 'firebase/firestore';
 * import {setFirebaseApp, Collection} from 'firestorter';
 *
 * // Initialize firebase app
 * firebase.initializeApp({...});
 *
 * // Initialize `firestorter`
 * setFirebaseApp(firebase);
 *
 * // Create collection and listen for real-time updates
 * const albums = new Collection('artists/Metallica/albumbs').start();
 * ...
 */
function setFirebaseApp(firebase: Firebase) {
	// globalFirebase = firebase;
	globalFirestore = firebase.firestore();
	if (!globalFirestore) {
		throw new Error('firebase.firestore() returned `undefined`, did you forget `import \'firebase/firestore\';`');
	}
}

function getFirestore() {
	if (!globalFirestore) {
		throw new Error('No firestore reference, did you forget to call `setFirebaseApp(firebase);` ?');
	}
	return globalFirestore;
}

export {
	setFirebaseApp,
	getFirestore
};
