# Installation

Install Firestorter and MobX:

    yarn add firestorter mobx mobx-react

## Usage with the JavaScript SDK 

To use Firestorter on the web, also install the [Firebase JavaScript SDK](https://www.npmjs.com/package/firebase):

    yarn add firebase

After that, initialize Firebase and Firestorter:

```js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initFirestorter } from 'firestorter';
import makeWebContext from 'firestorter/web';

// Initialize firebase app
const app = initializeApp({
  "apiKey": "xxxxxxxxxxxxxxxxxxxxxxxxxxx",
	"authDomain": "xxxxxxx.firebaseapp.com",
	"databaseURL": "https://xxxxxxxx.firebaseio.com",
	"projectId": "xxxxxxxxxxxx",
	"storageBucket": "xxxxxxxxxx.appspot.com",
	"messagingSenderId": "xxxxxxxxxxxxxxxx"
});
const firestore = getFirestore(app);

// And initialize `firestorter`
initFirestorter(makeWebContext({ firestore: firestore }));
```

## Usage with compat mode

```js
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { initFirestorter, makeCompatContext } from 'firestorter';

// Initialize firebase app
firebase.initializeApp({ ... });

// And initialize `firestorter`
initFirestorter(makeCompatContext({ firebase: firebase }));
```

## Usage with older JavaScript SDKs (<= v8)

```js
import firebase from 'firebase/app';
import 'firebase/firestore';
import { initFirestorter, makeCompatContext } from 'firestorter';

// Initialize firebase app
firebase.initializeApp({ ... });

// And initialize `firestorter`
initFirestorter(makeCompatContext({ firebase: firebase }));
```

## Usage with react-native

On react-native you can use `react-native-firebase` to add Firebase support to your project. First follow the instructions on [https://rnfirebase.io/](https://rnfirebase.io/) on how to setup Firebase for your react-native project.

After that, import the Firebase dependencies and initialize Firestorter:

```js
import { firebase } from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import { initFirestorter, makeCompatContext } from 'firestorter';

initFirestorter(makeCompatContext({ firebase: firebase }));
```

> [!NOTE]
> There is no need to call `firebase.initializeApp(..)` as the initialisation is done natively in `react-native-firebase`.
