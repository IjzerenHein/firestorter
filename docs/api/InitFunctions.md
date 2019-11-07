## Functions

<dl>
<dt><a href="#initFirestorter">initFirestorter(config)</a></dt>
<dd><p>Initializes <code>firestorter</code> with the firebase-app.</p></dd>
<dt><a href="#makeFirestorterContext">makeFirestorterContext()</a></dt>
<dd><p>If you need to use different firestore instances for different
collections, or otherwise want to avoid global state, you can
instead provide a &quot;context&quot; option when creating Document and
Collection instances.</p>
<p>This function takes the same arguments as <code>initFirestorter</code> and returns
a context suitable for Document and Collection creation.</p></dd>
</dl>

<a name="initFirestorter"></a>

## initFirestorter(config)
<p>Initializes <code>firestorter</code> with the firebase-app.</p>

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | <p>Configuration options</p> |
| config.firebase | <code>Firebase</code> | <p>Firebase reference</p> |
| [config.app] | <code>String</code> \| <code>FirebaseApp</code> | <p>FirebaseApp to use (when omitted the default app is used)</p> |

**Example**  
```js
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import {initFirestorter, Collection, Document} from 'firestorter';

// Initialize firebase app
firebase.initializeApp({...});

// Initialize `firestorter`
initFirestorter({firebase: firebase});

// Create collection or document
const albums = new Collection('artists/Metallica/albums');
...
const album = new Document('artists/Metallica/albums/BlackAlbum');
...
```
<a name="makeFirestorterContext"></a>

## makeFirestorterContext()
<p>If you need to use different firestore instances for different
collections, or otherwise want to avoid global state, you can
instead provide a &quot;context&quot; option when creating Document and
Collection instances.</p>
<p>This function takes the same arguments as <code>initFirestorter</code> and returns
a context suitable for Document and Collection creation.</p>

**Kind**: global function  
**Example**  
```js
import * as firebase from 'firebase/app';
import 'firebase/firestore'
import * as firetest from '@firebase/testing'
import { makeFirestorterContext, Collection, Document } from "firestorter"

function makeTestContext(fbtestArgs) {
	 const app = firetest.initializeTestApp(fbtestArgs)
  return makeFirestorterContext({
    firestore,
    app,
  })
}

// create collection or document without global state
test('collection and document using different apps', () => {
  const context1 = makeTestContext({ projectId: 'foo' })
  const context2 = makeTestContext({ projectId: 'bar' })

  // Create collection or document
  const albums = new Collection('artists/Metallica/albums', {context: context1});
  ...
  const album = new Document('artists/Metallica/albums/BlackAlbum', {context: context2});
  ...
})
```
