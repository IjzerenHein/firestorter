#!/usr/bin/env node

/* eslint-env node */
/* eslint no-console:0 */

const fs = require('fs');
const csvParse = require('csv-parse');
const firebase = require('firebase');
require('firebase/firestore');

const firebaseApp = firebase.initializeApp({
	apiKey: 'AIzaSyDgDX7GD9b8h8JxEB-ANs9LjlRkXpYpS3U',
	authDomain: 'firestorter-tests.firebaseapp.com',
	databaseURL: 'https://firestorter-tests.firebaseio.com',
	projectId: 'firestorter-tests',
	storageBucket: 'firestorter-tests.appspot.com',
	messagingSenderId: '667453207099'
});

function loadCSV(filename) {
	return new Promise((resolve, reject) => {
		const array = [];
		fs.createReadStream(filename)
			.pipe(csvParse({delimiter: ','}))
			.on('data', (csvrow) => array.push(csvrow))
			.on('end', () => resolve(array))
			.on('error', (error) => reject(error));
	});
}

async function main() {
	try {

		// Load CSV file
		console.info('Loading csv file...');
		//"Company","Origin",Ref,"Review Date","Cocoa Percent","Company Location",Rating,"Bean Type","Broad Bean Origin"
		const csvRows = await loadCSV('flavors_of_cacao.csv');
		console.info('Total number of documents: ', csvRows.length);

		// Use a write-batch to import all documents at once (=fast)
		const writeBatch = firebase.firestore().batch();

		// Add all documents to the batch
		console.info('Importing...');
		console.time('import');
		const count = csvRows.length;
		for (let i = 1; i < count; i++) {
			const row = csvRows[i];
			const id = Number(row[2]);
			const json = {
				company: row[0].trim(),
				origin: row[1].trim(),
				reviewDate: new Date(Number(row[3]), 1, 1, 0, 0, 0, 0),
				cocaoPercent: Number(row[4].substring(0, row[4].length - 1)) / 100,
				companyLocation: row[5].trim(),
				rating: Number(row[6]),
				beanType: row[7].trim(),
				broadBeanOrigin: row[8].trim()
			};
			// console.info('Adding ' + i + ' of ' + count + ': ' + row);
			const ref = firebase.firestore().doc('chocolateBars/' + id);
			writeBatch.set(ref, json);
		}

		// Import
		await writeBatch.commit();
		console.timeEnd('import');

	} catch (err) {
		console.error(err.message);
	}
	await firebaseApp.delete();
	process.exit();
}

main();

