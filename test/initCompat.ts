import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { configure } from 'mobx';

import { initFirestorter, getContext } from '../src';
import makeCompatContext from '../src/init/compat';

const firebaseConfig = require('./firebaseConfig.json');

let app: firebase.app.App;

beforeAll(() => {
  jest.setTimeout(10000);

  // Initialize firebase
  app = firebase.initializeApp(firebaseConfig);
  const firestore = app.firestore();

  // Configure mobx strict-mode
  configure({ enforceActions: 'always', computedRequiresReaction: true });

  // Initialize firestorter
  initFirestorter(makeCompatContext({ firebase, app, firestore }));

  // Verify that firestorter is initialized correctly
  if (!getContext()) throw new Error('getContext');
});

afterAll(() => {
  app.delete();
});
