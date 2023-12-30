import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { initFirestorter, Collection, Document } from 'firestorter';
import { struct } from 'superstruct';

firebase.initializeApp({
	apiKey: 'AIzaSyBiY-6xQrji8oe5E90d1P8J8OvfIo3F6kE',
	authDomain: 'firestore-mobx-todo.firebaseapp.com',
	databaseURL: 'https://firestore-mobx-todo.firebaseio.com',
	projectId: 'firestore-mobx-todo',
	storageBucket: 'firestore-mobx-todo.appspot.com',
	messagingSenderId: '680642766706',
});

initFirestorter({ firebase: firebase });

class Todo extends Document {
	constructor(source, options) {
		super(source, {
			...options,
			schema: struct({
				text: 'string',
				finished: 'boolean?',
			}),
		});
	}
}

const todos = new Collection('todos', {
	createDocument: (source, options) => new Todo(source, options),
});

export { todos };
