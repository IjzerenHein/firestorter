import firebase from 'firebase';
import 'firebase/firestore';
import { initFirestorter, Collection } from 'firestorter';

firebase.initializeApp({
	apiKey: 'AIzaSyDgDX7GD9b8h8JxEB-ANs9LjlRkXpYpS3U',
	authDomain: 'firestorter-tests.firebaseapp.com',
	databaseURL: 'https://firestorter-tests.firebaseio.com',
	projectId: 'firestorter-tests',
	storageBucket: 'firestorter-tests.appspot.com',
	messagingSenderId: '667453207099'
});

initFirestorter({ firebase: firebase });

const chocolateBars = new Collection('chocolateBars');
chocolateBars.limit = 5;

export { chocolateBars };
