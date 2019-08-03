import * as firebase from "firebase/app";
import "firebase/firestore";
import { initFirestorter, Collection, Document } from "firestorter";

firebase.initializeApp({
	apiKey: "AIzaSyBiY-6xQrji8oe5E90d1P8J8OvfIo3F6kE",
	authDomain: "firestore-mobx-todo.firebaseapp.com",
	databaseURL: "https://firestore-mobx-todo.firebaseio.com",
	messagingSenderId: "680642766706",
	projectId: "firestore-mobx-todo",
	storageBucket: "firestore-mobx-todo.appspot.com"
});

initFirestorter({ firebase });

export interface TodoType {
	finished?: boolean;
	text: string;
}

export type Todo = Document<TodoType>;

export type Todos = Collection<Todo>;

const todos = new Collection<Todo>("todos");

export { todos };
