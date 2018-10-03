import firebase from 'firebase';
import 'firebase/firestore';
import { initFirestorter, getFirestore, getFirebase, getFirebaseApp, Collection, Document } from '../src';
import { autorun, reaction, observable } from 'mobx';
import firebaseConfig from './firebaseConfig.json';

let firebaseApp;

beforeAll(() => {
	firebaseApp = firebase.initializeApp(firebaseConfig);
	const firestore = firebase.firestore();
	firestore.settings({ timestampsInSnapshots: true });

	initFirestorter({ firebase: firebase, app: firebaseApp });

	// Verify that firestorter is initialized correctly
	if(!getFirebase()) throw new Error('getFirebase');
	if(!getFirebaseApp()) throw new Error('getFirebaseApp');
	if(!getFirestore()) throw new Error('getFirestore');
});

afterAll(() => {
	firebaseApp.delete();
});

export {
	firebase,
	initFirestorter,
	getFirestore,
	Collection,
	Document,
	autorun,
	reaction,
	observable
};
