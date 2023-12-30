#!/usr/bin/env node

import { initializeApp, deleteApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, deleteDoc, getDocs } from 'firebase/firestore';

import firebaseConfig from './firebaseConfig.json';
import sampleData from './sampleData.json';

// Initialize firestore
const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);

const addDoc = (colId, docId, docData) => {
  const path = colId + '/' + docId;
  console.info('Setting: ' + path + ' -> ' + JSON.stringify(docData));
  return setDoc(doc(firestore, path), docData);
};

const deleteCol = async (colId, keepDocIds) => {
  const snap = await getDocs(collection(firestore, colId));
  await Promise.all(
    snap.docs
      .filter((d) => !keepDocIds.includes(d.id))
      .map(async (d) => {
        console.info('Deleting: ' + d.ref.path);
        return deleteDoc(d.ref);
      })
  );
};

// Seed the sample data
console.info('Seeding firebase project with sample data...');
try {

  // Delete documents from collections
  await Promise.all(
    Object.entries(sampleData).map(([colId, colData]) => deleteCol(colId, Object.keys(colData)))
  )

  // Add documents
  await Promise.all(
    Object.entries(sampleData).map(([colId, colData]) =>
      Promise.all(
        Object.entries(colData).map(([docId, docData]) => addDoc(colId, docId, docData))
      )
    )
  )

  console.info('DONE');
  await deleteApp(firebaseApp);
  process.exit(0);
} catch (err) {
  console.error(err);
}

