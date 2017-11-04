import firebase from 'firebase';
import 'firebase/firestore';
import {Collection} from 'react-firestore-mobx';

firebase.initializeApp({
	apiKey: 'AIzaSyBiY-6xQrji8oe5E90d1P8J8OvfIo3F6kE',
	authDomain: 'firestore-mobx-todo.firebaseapp.com',
	databaseURL: 'https://firestore-mobx-todo.firebaseio.com',
	projectId: 'firestore-mobx-todo',
	storageBucket: 'firestore-mobx-todo.appspot.com',
	messagingSenderId: '680642766706'
});

const db = firebase.firestore();
const todos = new Collection(db.collection('todos')).start();

export {
	todos
};
