# Installation

Install Firestorter and MobX:

    yarn add firestorter mobx mobx-react

## Usage on the web

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

## Usage older or compat firebase versions

```js
import firebase from 'firebase/compat/app';
import  from 'firebase/compat/firestore';
import { initFirestorter, makeCompatContext } from 'firestorter';
import makeWebContext from 'firestorter/web';

// Initialize firebase app
firebase.initializeApp({ ... });

// And initialize `firestorter`
initFirestorter(makeWebContext({ firebase: firebase }));
```

## Usage with react-native

On react-native you can use `react-native-firebase` to add Firebase support to your project. First follow the instructions on [https://rnfirebase.io/](https://rnfirebase.io/) on how to setup Firebase for your react-native project.

> [!WARNING]
> The latest version of MobX (>= 5) requires ES6 Proxy support and this might not be available on older Android JavaScriptCore (JSC) environments. You therefore may need to upgrade the JSC or use MobX 4 instead. Both will work. If you don't want the hassle of upgrading the JSC, just install `yarn add mobx@4`. [You can find more info here.](https://mobx.js.org/README.html#browser-support)


After that, import the Firebase dependencies and initialize Firestorter:

**react-native-firebase v5:**

```js
import firebase from 'react-native-firebase';
import { initFirestorter, makeCompatContext } from 'firestorter';

initFirestorter(makeCompatContext({ firebase: firebase }));
```

**react-native-firebase >= v6:**

```js
import { firebase } from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import { initFirestorter, makeCompatContext } from 'firestorter';

initFirestorter(makeCompatContext({ firebase: firebase }));
```

> [!NOTE]
> There is no need to call `firebase.initializeApp(..)` as the initialisation is done natively in `react-native-firebase`.
