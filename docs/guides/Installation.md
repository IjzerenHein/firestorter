# Installation

Install Firestorter and MobX:

    yarn add firestorter mobx mobx-react


## Usage on the web

To use Firestorter on the web, also install the [Firebase JavaScript SDK](https://www.npmjs.com/package/firebase):

    yarn add firebase

After that, initialize Firebase and Firestorter:

```js
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { initFirestorter } from 'firestorter';

// Initialize firebase app
firebase.initializeApp({
  "apiKey": "xxxxxxxxxxxxxxxxxxxxxxxxxxx",
	"authDomain": "xxxxxxx.firebaseapp.com",
	"databaseURL": "https://xxxxxxxx.firebaseio.com",
	"projectId": "xxxxxxxxxxxx",
	"storageBucket": "xxxxxxxxxx.appspot.com",
	"messagingSenderId": "xxxxxxxxxxxxxxxx"
});

// And initialize `firestorter`
initFirestorter({ firebase: firebase });
```

## Usage with react-native

On react-native you can use `react-native-firebase` to add Firebase support to your project. First follow the instructions on [https://rnfirebase.io/](https://rnfirebase.io/) on how to setup Firebase for your react-native project.

> [!WARNING]
> The latest version of MobX (>= 5) requires ES6 Proxy support and this might not be available on older Android JavaScriptCore (JSC) environments. You therefore may need to upgrade the JSC or use MobX 4 instead. Both will work. If you don't want the hassle of upgrading the JSC, just install `yarn add mobx@4`. [You can find more info here.](https://mobx.js.org/README.html#browser-support)


After that, import the Firebase dependencies and initialize Firestorter:

**react-native-firebase v5:**

```js
import firebase from 'react-native-firebase';
import { initFirestorter } from 'firestorter';

initFirestorter({ firebase: firebase });
```

**react-native-firebase >= v6:**

```js
import { firebase } from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import { initFirestorter } from 'firestorter';

initFirestorter({ firebase: firebase });
```

> [!NOTE]
> There is no need to call `firebase.initializeApp(..)` as the initialisation is done natively in `react-native-firebase`.
