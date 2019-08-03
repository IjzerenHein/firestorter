#!/usr/bin/env node

const firebase = require('firebase');
require('firebase/firestore');
const firebaseConfig = require('./firebaseConfig.json');
const sampleData = require('./sampleData.json');

// Initialize firestore
const firebaseApp = firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

const addDoc = (colId, docId, docData) => {
	const path = colId + '/' + docId;
	console.info('Setting: ' + path + ' -> ' + JSON.stringify(docData));
	return firestore.doc(path).set(docData);
};

const deleteCol = async (colId, keepDocIds) => {
	const snap = await firestore.collection(colId).get();
	await Promise.all(
		snap.docs
			.filter(d => !keepDocIds.includes(d.id))
			.map(async d => {
				console.info('Deleting: ' + d.ref.path);
				return d.ref.delete();
			})
	);
};

// Seed the sample data
console.info('Seeding firebase project with sample data...');
Promise.all(
	Object.entries(sampleData).map(([colId, colData]) =>
		deleteCol(colId, Object.keys(colData))
	)
)
	.then(() =>
		Promise.all(
			Object.entries(sampleData).map(([colId, colData]) =>
				Promise.all(
					Object.entries(colData).map(([docId, docData]) =>
						addDoc(colId, docId, docData)
					)
				)
			)
		)
	)
	.then(
		() => {
			console.info('DONE');
			firebaseApp.delete();
			// process.exit(0);
		},
		err => {
			console.error(err.message);
		}
	);
