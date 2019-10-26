#!/usr/bin/env node

/* eslint-env node */
/* eslint no-console:0 */

/**
 Small node example that shows how to import a CSV file into firestore.
 */

const fs = require('fs');
const csvParse = require('csv-parse');
const firebase = require('firebase');
const firebaseConfig = require('../../test/firebaseConfig.json');
const { encodeGeohash } = require('../../lib/firestorter.js');
require('firebase/firestore');

const firebaseApp = firebase.initializeApp(firebaseConfig);

function loadCSV(filename) {
	return new Promise((resolve, reject) => {
		const array = [];
		fs.createReadStream(filename)
			.pipe(csvParse({ delimiter: ',' }))
			.on('data', csvrow => array.push(csvrow))
			.on('end', () => resolve(array))
			.on('error', error => reject(error));
	});
}

function saveCSV(filename, rows) {
	return new Promise((resolve, reject) => {
		const safeRows = rows.map(row =>
			row.map(field => {
				if (field.indexOf('"') >= 0) {
					return '"' + field.replace(/"/g, '""') + '"';
				} else if (field.indexOf(',') >= 0) {
					return '"' + field + '"';
				} else {
					return field;
				}
			})
		);
		const text = safeRows.map(row => row.join(',')).join('\n') + '\n';
		fs.writeFile(filename, text, err => {
			if (err) {
				reject(err);
			} else {
				resolve(true);
			}
		});
	});
}

async function addLocationToCSV(rows) {
	const googleMapsClient = require('@google/maps').createClient({
		key: '__API_KEY_GOES_HERE__',
		Promise: Promise
	});
	const cache = {};
	rows[0].push('Latitude');
	rows[0].push('Longitude');
	for (let i = 1; i < rows.length; i++) {
		const row = rows[i];
		const location = row[5].trim();
		let geoPoint = cache[location];
		if (!geoPoint) {
			console.info(`Resolving location ${location}...`);
			const response = await googleMapsClient
				.geocode({ address: location })
				.asPromise();
			//console.log(response.json);
			geoPoint = response.json.results.map(result => ({
				latitude: result.geometry.location.lat,
				longitude: result.geometry.location.lng
			}))[0];
			console.info(
				`Resolving location ${location}... DONE: ${JSON.stringify(geoPoint)}`
			);
			cache[location] = geoPoint;
		} else {
			console.info(
				`Location ${location} already known, not resolving again...`
			);
		}
		if (geoPoint) {
			row.push(geoPoint.latitude + '');
			row.push(geoPoint.longitude + '');
		}
	}
}

async function importCSVRows(rows) {
	// Add all documents to the batch
	console.info(`Importing ${rows.length} rows...`);
	console.time('import');
	const count = rows.length;
	const writeBatch = firebase.firestore().batch();
	for (let i = 0; i < count; i++) {
		const row = rows[i];
		const id = Number(row[2]);
		const latitude = Number(row[9]);
		const longitude = Number(row[9]);
		const json = {
			company: row[0].trim(),
			origin: row[1].trim(),
			reviewDate: new Date(Number(row[3]), 1, 1, 0, 0, 0, 0),
			cocaoPercent: Number(row[4].substring(0, row[4].length - 1)) / 100,
			companyLocation: row[5].trim(),
			rating: Number(row[6]),
			beanType: row[7].trim(),
			broadBeanOrigin: row[8].trim(),
			location: new firebase.firestore.GeoPoint(latitude, longitude),
			geohash: encodeGeohash({
				latitude,
				longitude
			})
		};
		// console.info('Adding ' + i + ' of ' + count + ': ' + row);
		const ref = firebase.firestore().doc('chocolateBars/' + id);
		writeBatch.set(ref, json);
	}
	await writeBatch.commit();
	console.timeEnd('import');
}

async function importCSV(rows) {
	for (let i = 1; i < rows.length; i += 400) {
		await importCSVRows(rows.slice(i, Math.min(i + 400, rows.length)));
	}
}

async function main() {
	try {
		// Load CSV file
		console.info('Loading csv file...');
		//"Company","Origin",Ref,"Review Date","Cocoa Percent","Company Location",Rating,"Bean Type","Broad Bean Origin"
		const rows = await loadCSV('flavors_of_cacao.csv');
		console.info('Total number of documents: ', rows.length);

		// Add location to CSV
		//await addLocationToCSV(rows);
		//await saveCSV('flavors_of_cacao_NEW.csv', rows);

		// Import
		await importCSV(rows);
	} catch (err) {
		console.error(err.message);
	}
	await firebaseApp.delete();
	process.exit();
}

main();
