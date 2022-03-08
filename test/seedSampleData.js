#!/usr/bin/env node

const { initializeApp, deleteApp } = require('firebase/app');
const { getFirestore, doc, setDoc, collection, deleteDoc, getDocs } = require('firebase/firestore');

const firebaseConfig = require('./firebaseConfig.json');
const sampleData = require('./sampleData.json');

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
Promise.all(
  Object.entries(sampleData).map(([colId, colData]) => deleteCol(colId, Object.keys(colData)))
)
  .then(() =>
    Promise.all(
      Object.entries(sampleData).map(([colId, colData]) =>
        Promise.all(
          Object.entries(colData).map(([docId, docData]) => addDoc(colId, docId, docData))
        )
      )
    )
  )
  .then(
    () => {
      console.info('DONE');
      deleteApp(firebaseApp);
      // process.exit(0);
    },
    (err) => {
      console.error(err.message);
    }
  );
