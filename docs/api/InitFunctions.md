## Functions

<dl>
<dt><a href="#initFirestorter">initFirestorter(config)</a></dt>
<dd><p>Initializes <code>firestorter</code> with the firebase-app.</p></dd>
<dt><a href="#makeCompatContext">makeCompatContext(config)</a></dt>
<dd><p>Creates a firestorter compat context.</p></dd>
</dl>

<a name="initFirestorter"></a>

## initFirestorter(config)
<p>Initializes <code>firestorter</code> with the firebase-app.</p>

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>IContext</code> \| <code>FirestorterCompatConfig</code> | <p>Configuration options</p> |

**Example**  
```js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initFirestorter, Collection, Document } from 'firestorter'; 

// Initialize firebase app
const app = initializeApp({...});
const firestore = getFirestore(app);

// Initialize `firestorter`
initFirestorter({ app, firestore });

// Create collection or document
const albums = new Collection('artists/Metallica/albums');
...
const album = new Document('artists/Metallica/albums/BlackAlbum');
...
```
<a name="makeCompatContext"></a>

## makeCompatContext(config)
<p>Creates a firestorter compat context.</p>

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | <p>Configuration options</p> |
| config.firebase | <code>Firebase</code> | <p>Firebase instance</p> |
| [config.app] | <code>FirebaseApp</code> \| <code>string</code> | <p>Firebase app instance or name</p> |
| [config.firestore] | <code>Firestore</code> | <p>Firestore instance</p> |

**Example**  
```js
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Collection, Document, makeCompatContext } from 'firestorter'

// Initialize firebase app
firebase.initializeApp({...});

// Initialize global `firestorter` context
initFirestorter(makeCompatContext({ firebase: firebase }));

// Create collection or document
const albums = new Collection('artists/Metallica/albums');
...
const album = new Document('artists/Metallica/albums/BlackAlbum');
...

// Or create a custom context to connect to another Firebase app
const app2 = firebase.initializeApp({...});
const app2Context = makeCompatContext({ firebase: firebase, app: app2 });

// Create collection or document
const albums2 = new Collection('artists/Metallica/albums', {context: app2Context});
...
const album2 = new Document('artists/Metallica/albums/BlackAlbum', {context: app2Context});
...
```
