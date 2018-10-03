#!/usr/bin/env node

const firebase = require('firebase');
require('firebase/firestore');
const firebaseConfig = require('./firebaseConfig.json');
const sampleData = require('./sampleData.json');

// Initialize firestore
const firebaseApp = firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
firestore.settings({ timestampsInSnapshots: true });

// Seed the sample data
console.info('Seeding firebase project with sample data...');
Promise.all(Object.keys(sampleData).map((colId) => {
	return Promise.all(Object.keys(sampleData[colId]).map((docId) => {
		const docData = sampleData[colId][docId];
		console.info('Setting: ' + colId + '/' + docId + ' -> ' + JSON.stringify(docData));
		return firestore.doc(colId + '/' + docId).set(docData);
	}));
})).then(() => {
	console.info('DONE');
	firebaseApp.delete();
	// process.exit(0);
}, (err) => {
	console.error(err.message);
});
