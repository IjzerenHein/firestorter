import firebase from 'firebase';
import 'firebase/firestore';
import { initFirestorter, getFirestore, Collection, Document } from '../src';
import { autorun, reaction, observable } from 'mobx';

let firebaseApp;

beforeAll(() => {
	firebaseApp = firebase.initializeApp({
		apiKey: 'AIzaSyDgDX7GD9b8h8JxEB-ANs9LjlRkXpYpS3U',
		authDomain: 'firestorter-tests.firebaseapp.com',
		databaseURL: 'https://firestorter-tests.firebaseio.com',
		projectId: 'firestorter-tests',
		storageBucket: 'firestorter-tests.appspot.com',
		messagingSenderId: '667453207099'
	});
	const firestore = firebase.firestore();
	firestore.settings({ timestampsInSnapshots: true });

	initFirestorter({ firebase: firebase });
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
