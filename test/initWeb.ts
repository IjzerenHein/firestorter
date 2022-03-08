import { initializeApp, FirebaseApp, deleteApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { configure } from 'mobx';

import { initFirestorter, getContext } from '../src';
import makeWebContext from '../src/init/web';

const firebaseConfig = require('./firebaseConfig.json');

let app: FirebaseApp;

beforeAll(() => {
  jest.setTimeout(10000);

  // Initialize firebase
  app = initializeApp(firebaseConfig);
  const firestore = getFirestore(app);

  // Configure mobx strict-mode
  configure({ enforceActions: 'always', computedRequiresReaction: true });

  // Initialize firestorter
  initFirestorter(makeWebContext({ firestore }));

  // Verify that firestorter is initialized correctly
  if (!getContext()) throw new Error('getContext');
});

afterAll(() => {
  deleteApp(app);
});
