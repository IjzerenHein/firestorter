# Initialisation

## TypeScript

Firestorter is written in TypeScript and supports TypeScript as first-class citizen.
It comes bundled with its own type-definitions so there is no need to import these separately.
To use Firestorter in TypeScript, use:

```js
import * as firebase from "firebase/app";
import "firebase/firestore";
import { initFirestorter } from "firestorter";

// Initialize the main app
const app = firebase.initializeApp({
	...
});

// Initialize firestorter
initFirestorter({ firebase });
```
