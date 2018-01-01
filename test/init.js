import firebase from 'firebase';
import 'firebase/firestore';
import { initFirestorter, Collection, Document } from '../src';
import { autorun, reaction } from 'mobx';

beforeAll(() => {
	firebase.initializeApp({
		apiKey: 'AIzaSyDgDX7GD9b8h8JxEB-ANs9LjlRkXpYpS3U',
		authDomain: 'firestorter-tests.firebaseapp.com',
		databaseURL: 'https://firestorter-tests.firebaseio.com',
		projectId: 'firestorter-tests',
		storageBucket: 'firestorter-tests.appspot.com',
		messagingSenderId: '667453207099'
	});

	initFirestorter({ firebase: firebase });
});

export { firebase, initFirestorter, Collection, Document, autorun, reaction };
