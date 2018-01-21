// @flow
let globalFirestore;

/**
 * Initializes `firestorter` with the firebase-app.
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
function initFirestorter(config: any) {
	/* if (globalFirestore) {
		throw new Error(
			'Firestorter already initialized, did you accidentally call `initFirestorter()` again?'
		);
	}*/
	globalFirestore = config.firebase.firestore();
	if (!globalFirestore) {
		throw new Error(
			"firebase.firestore() returned `undefined`, did you forget `import 'firebase/firestore';`"
		);
	}
}

function getFirestore() {
	if (!globalFirestore) {
		throw new Error(
			'No firestore reference, did you forget to call `initFirestorter({firebase: firebase})` ?'
		);
	}
	return globalFirestore;
}

function verifyMode(mode: string) {
	switch (mode) {
		case 'auto':
		case 'off':
		case 'on':
			return mode;
		default:
			throw new Error('Invalid mode mode: ' + mode);
	}
}

export { initFirestorter, getFirestore, verifyMode };
