## Classes

<dl>
<dt><a href="#Collection">Collection</a></dt>
<dd><p>The Collection class lays at the heart of <code>firestorter</code>.
It represents a collection in Firestore and its queried data. It is
observable so that it can be efficiently linked to a React Component
using <code>mobx-react</code>&#39;s <code>observer</code> pattern.</p>
<p>Collection supports three modes of real-time updating:</p>
<ul>
<li>&quot;off&quot; (real-time updating is turned off)</li>
<li>&quot;on&quot; (real-time updating is permanently turned on)</li>
<li>&quot;auto&quot; (real-time updating is enabled on demand) (default)</li>
</ul>
<p>The &quot;auto&quot; mode ensures that Collection only communicates with
the firestore back-end whever the Collection is actually
rendered by a Component. This prevents unneccesary background
updates and leads to the best possible performance.</p>
<p>When real-time updates are enabled, data is automatically fetched
from Firestore whenever it changes in the back-end (using <code>onSnapshot</code>).
This enables almost magical instant updates. When data is changed,
only those documents are updated that have actually changed. Document
objects are re-used where possible, and just their data is updated.
The same is true for the <code>docs</code> property. If no documents where
added, removed, re-ordered, then the <code>docs</code> property itself will not
change.</p>
<p>Alternatively, you can keep real-time updates turned off and fetch
manually. This will update the Collection as efficiently as possible.
If nothing has changed on the back-end, no new Documents would be
created or modified.</p></dd>
<dt><a href="#Document">Document</a></dt>
<dd><p>Document represents a document stored in the firestore no-sql database.
Document is observable so that it can be efficiently linked to a React
Component using <code>mobx-react</code>&#39;s <code>observer</code> pattern. This ensures that a
component is only re-rendered when data that is accessed in the <code>render</code>
function has changed.</p></dd>
</dl>

## Members

<dl>
<dt><a href="#Mode">Mode</a></dt>
<dd><p>Real-time updating mode.</p></dd>
</dl>

## Functions

<dl>
<dt><a href="#initFirestorter">initFirestorter(config)</a></dt>
<dd><p>Initializes <code>firestorter</code> with the firebase-app.</p></dd>
<dt><a href="#mergeUpdateData">mergeUpdateData(data, fields)</a> ⇒ <code>Object</code></dt>
<dd><p>Helper function which merges data into the source
and returns the new object.</p></dd>
</dl>

<a name="Collection"></a>

## Collection
<p>The Collection class lays at the heart of <code>firestorter</code>.
It represents a collection in Firestore and its queried data. It is
observable so that it can be efficiently linked to a React Component
using <code>mobx-react</code>'s <code>observer</code> pattern.</p>
<p>Collection supports three modes of real-time updating:</p>
<ul>
<li>&quot;off&quot; (real-time updating is turned off)</li>
<li>&quot;on&quot; (real-time updating is permanently turned on)</li>
<li>&quot;auto&quot; (real-time updating is enabled on demand) (default)</li>
</ul>
<p>The &quot;auto&quot; mode ensures that Collection only communicates with
the firestore back-end whever the Collection is actually
rendered by a Component. This prevents unneccesary background
updates and leads to the best possible performance.</p>
<p>When real-time updates are enabled, data is automatically fetched
from Firestore whenever it changes in the back-end (using <code>onSnapshot</code>).
This enables almost magical instant updates. When data is changed,
only those documents are updated that have actually changed. Document
objects are re-used where possible, and just their data is updated.
The same is true for the <code>docs</code> property. If no documents where
added, removed, re-ordered, then the <code>docs</code> property itself will not
change.</p>
<p>Alternatively, you can keep real-time updates turned off and fetch
manually. This will update the Collection as efficiently as possible.
If nothing has changed on the back-end, no new Documents would be
created or modified.</p>

**Kind**: global class  

* [Collection](#Collection)
    * [new Collection([options], options)](#new_Collection_new)
    * [.docs](#Collection+docs)
    * [.ref](#Collection+ref)
    * [.id](#Collection+id)
    * [.path](#Collection+path)
    * [.query](#Collection+query)
    * [.mode](#Collection+mode)
    * [.isActive](#Collection+isActive)
    * [.isLoading](#Collection+isLoading)
    * [.fetch()](#Collection+fetch)
    * [.ready()](#Collection+ready)
    * [.add()](#Collection+add)
    * [.deleteAll()](#Collection+deleteAll)

<a name="new_Collection_new"></a>

### new Collection([options], options)

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | <p>Configuration options</p> |
| options |  |  |
| [options.query] | <code>function</code> \| <code>Query</code> | <p>See <code>Collection.query</code></p> |
| [options.mode] | <code>String</code> | <p>See <code>Collection.mode</code></p> |
| [options.createDocument] | <code>function</code> | <p>Factory function for creating documents <code>(source, options) =&gt; new Document(source, options)</code></p> |
| [options.minimizeUpdates] | <code>Bool</code> | <p>Enables additional algorithms to reduces updates to your app (e.g. when snapshots are received in rapid succession)</p> |
| [options.debug] | <code>Bool</code> | <p>Enables debug logging</p> |
| [options.debugName] | <code>String</code> | <p>Name to use when debug logging is enabled</p> |

**Example**  
```js
import {Collection} from 'firestorter';

// Create a collection using path (preferred)
const col = new Collection('artists/Metallica/albums');

// Create a collection using a reference
const col2 = new Collection(firebase.firestore().collection('todos'));

// Create a collection and permanently start real-time updating
const col2 = new Collection('artists', {
  mode: 'on'
});

// Create a collection with a query on it
const col3 = new Collection('artists', {
  query: (ref) => ref.orderBy('name', 'asc')
});
```
**Example**  
```js
// In manual mode, just call `fetch` explicitely
const col = new Collection('albums');
col.fetch().then((collection) => {
  collection.docs.forEach((doc) => console.log(doc));
});

// Yo can use the `isLoading` property to see whether a fetch
// is in progress
console.log(col.isLoading);
```
<a name="Collection+docs"></a>

### collection.docs
<p>Array of all the documents that have been fetched
from firestore.</p>

**Kind**: instance property of [<code>Collection</code>](#Collection)  
**Example**  
```js
collection.docs.forEach((doc) => {
  console.log(doc.data);
});
```
<a name="Collection+ref"></a>

### collection.ref
<p>Firestore collection reference.</p>
<p>Use this property to get or set the collection
reference. When set, a fetch to the new collection
is performed.</p>
<p>Alternatively, you can also use <code>path</code> to change the
reference in more a readable way.</p>

**Kind**: instance property of [<code>Collection</code>](#Collection)  
**Example**  
```js
const col = new Collection(firebase.firestore().collection('albums/splinter/tracks'));
...
// Switch to another collection
col.ref = firebase.firestore().collection('albums/americana/tracks');
```
<a name="Collection+id"></a>

### collection.id
<p>Id of the Firestore collection (e.g. 'tracks').</p>
<p>To get the full-path of the collection, use <code>path</code>.</p>

**Kind**: instance property of [<code>Collection</code>](#Collection)  
<a name="Collection+path"></a>

### collection.path
<p>Path of the collection (e.g. 'albums/blackAlbum/tracks').</p>
<p>Use this property to switch to another collection in
the back-end. Effectively, it is a more compact
and readable way of setting a new ref.</p>

**Kind**: instance property of [<code>Collection</code>](#Collection)  
**Example**  
```js
const col = new Collection('artists/Metallica/albums');
...
// Switch to another collection in the back-end
col.path = 'artists/EaglesOfDeathMetal/albums';
```
<a name="Collection+query"></a>

### collection.query
<p>Use this property to set any order-by, where,
limit or start/end criteria. When set, that query
is used to retrieve any data. When cleared, the collection
reference is used.</p>
<p>The query can be either a Function of the form
<code>(CollectionReference) =&gt; Query</code> (preferred), or a direct
Firestore Query object.</p>

**Kind**: instance property of [<code>Collection</code>](#Collection)  
**Example**  
```js
const todos = new Collection('todos');

// Sort the collection
todos.query = (ref) => ref.orderBy('text', 'asc');

// Order, filter & limit
todos.query = (ref) => ref.where('finished', '==', false).orderBy('finished', 'asc').limit(20);

// Clear the query, will cause whole collection to be fetched
todos.query = undefined;
```
<a name="Collection+mode"></a>

### collection.mode
<p>Real-time updating mode.</p>
<p>Can be set to any of the following values:</p>
<ul>
<li>&quot;auto&quot; (enables real-time updating when the collection is observed)</li>
<li>&quot;off&quot; (no real-time updating, you need to call fetch explicitly)</li>
<li>&quot;on&quot; (real-time updating is permanently enabled)</li>
</ul>

**Kind**: instance property of [<code>Collection</code>](#Collection)  
<a name="Collection+isActive"></a>

### collection.isActive
<p>Returns true when the Collection is actively listening
for changes in the firestore back-end.</p>

**Kind**: instance property of [<code>Collection</code>](#Collection)  
<a name="Collection+isLoading"></a>

### collection.isLoading
<p>True when new data is being loaded.</p>
<p>Fetches are performed in these cases:</p>
<ul>
<li>When real-time updating is started</li>
<li>When a different <code>ref</code> or <code>path</code> is set</li>
<li>When a <code>query</code> is set or cleared</li>
<li>When <code>fetch</code> is explicitely called</li>
</ul>

**Kind**: instance property of [<code>Collection</code>](#Collection)  
**Example**  
```js
const col = new Collection('albums', {mode: 'off'});
console.log(col.isLoading);  // false
col.fetch();                 // start fetch
console.log(col.isLoading);  // true
await col.ready();           // wait for fetch to complete
console.log(col.isLoading);  // false
```
**Example**  
```js
const col = new Collection('albums');
console.log(col.isLoading);  // false
const dispose = autorun(() => {
  console.log(col.docs);     // start observing collection data
});
console.log(col.isLoading);  // true
...
dispose();                   // stop observing collection data
console.log(col.isLoading);  // false
```
<a name="Collection+fetch"></a>

### collection.fetch()
<p>Fetches new data from firestore. Use this to manually fetch
new data when <code>mode</code> is set to 'off'.</p>

**Kind**: instance method of [<code>Collection</code>](#Collection)  
**Example**  
```js
const col = new Collection('albums', 'off');
col.fetch().then(({docs}) => {
  docs.forEach(doc => console.log(doc));
});
```
<a name="Collection+ready"></a>

### collection.ready()
<p>Promise that is resolved when the Collection has
finished fetching its (initial) documents.</p>
<p>Use this method to for instance wait for
the initial snapshot update to complete, or to wait
for fresh data after changing the path/ref.</p>

**Kind**: instance method of [<code>Collection</code>](#Collection)  
**Example**  
```js
const col = new Collection('albums', {mode: 'on'});
await col.ready();
console.log('albums: ', col.docs);
```
**Example**  
```js
const col = new Collection('artists/FooFighters/albums', {mode: 'on'});
await col.ready();
...
// Changing the path causes a new snapshot update
col.path = 'artists/TheOffspring/albums';
await col.ready();
console.log('albums: ', col.docs);
```
<a name="Collection+add"></a>

### collection.add()
<p>Add a new document to this collection with the specified
data, assigning it a document ID automatically.</p>

**Kind**: instance method of [<code>Collection</code>](#Collection)  
**Example**  
```js
const doc = await collection.add({
  finished: false,
  text: 'New todo',
  options: {
    highPrio: true
  }
});
```
<a name="Collection+deleteAll"></a>

### collection.deleteAll()
<p>Deletes all the documents in the collection or query.</p>
<p>TODO - Not implemented yet</p>

**Kind**: instance method of [<code>Collection</code>](#Collection)  
<a name="Document"></a>

## Document
<p>Document represents a document stored in the firestore no-sql database.
Document is observable so that it can be efficiently linked to a React
Component using <code>mobx-react</code>'s <code>observer</code> pattern. This ensures that a
component is only re-rendered when data that is accessed in the <code>render</code>
function has changed.</p>

**Kind**: global class  

* [Document](#Document)
    * [new Document([options])](#new_Document_new)
    * [.schema](#Document+schema)
    * [.data](#Document+data)
    * [.ref](#Document+ref)
    * [.id](#Document+id)
    * [.path](#Document+path)
    * [.mode](#Document+mode)
    * [.isActive](#Document+isActive)
    * [.snapshot](#Document+snapshot)
    * [.isLoading](#Document+isLoading)
    * [.update()](#Document+update)
    * [.set(data, [options])](#Document+set)
    * [.delete()](#Document+delete)
    * [.fetch()](#Document+fetch)
    * [.ready()](#Document+ready)
    * [.addCollectionRef()](#Document+addCollectionRef)

<a name="new_Document_new"></a>

### new Document([options])

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | <p>Configuration options</p> |
| [options.mode] | <code>String</code> | <p>See <code>Document.mode</code> (default: auto)</p> |
| [options.schema] | <code>Object</code> | <p>Superstruct schema for data validation</p> |
| [options.snapshot] | <code>DocumentSnapshot</code> | <p>Initial document snapshot</p> |
| [options.debug] | <code>Bool</code> | <p>Enables debug logging</p> |
| [options.debugName] | <code>String</code> | <p>Name to use when debug logging is enabled</p> |

<a name="Document+schema"></a>

### document.schema
<p>Returns the superstruct schema used to validate the
document, or undefined.</p>

**Kind**: instance property of [<code>Document</code>](#Document)  
<a name="Document+data"></a>

### document.data
<p>Returns the data inside the firestore document.</p>

**Kind**: instance property of [<code>Document</code>](#Document)  
**Example**  
```js
todos.docs.map((doc) => {
  console.log(doc.data);
  // {
  //   finished: false
  //   text: 'Must do this'
  // }
});
```
<a name="Document+ref"></a>

### document.ref
<p>Firestore document reference.</p>
<p>Use this property to get or set the
underlying document reference.</p>
<p>Alternatively, you can also use <code>path</code> to change the
reference in more a readable way.</p>

**Kind**: instance property of [<code>Document</code>](#Document)  
**Example**  
```js
const doc = new Document('albums/splinter');

// Get the DocumentReference for `albums/splinter`
const ref = doc.ref;

// Switch to another document
doc.ref = firebase.firestore().doc('albums/americana');
```
<a name="Document+id"></a>

### document.id
<p>Id of the firestore document.</p>
<p>To get the full-path of the document, use <code>path</code>.</p>

**Kind**: instance property of [<code>Document</code>](#Document)  
<a name="Document+path"></a>

### document.path
<p>Path of the document (e.g. 'albums/blackAlbum').</p>
<p>Use this property to switch to another document in
the back-end. Effectively, it is a more compact
and readable way of setting a new ref.</p>

**Kind**: instance property of [<code>Document</code>](#Document)  
**Example**  
```js
const doc = new Document('artists/Metallica');
...
// Switch to another document in the back-end
doc.path = 'artists/EaglesOfDeathMetal';

// Or, you can use a reactive function to link
// to the contents of another document.
const doc2 = new Document('settings/activeArtist');
doc.path = () => 'artists/' + doc2.data.artistId;
```
<a name="Document+mode"></a>

### document.mode
<p>Real-time updating mode.</p>
<p>Can be set to any of the following values:</p>
<ul>
<li>&quot;auto&quot; (enables real-time updating when the document becomes observed)</li>
<li>&quot;off&quot; (no real-time updating, you need to call fetch explicitly)</li>
<li>&quot;on&quot; (real-time updating is permanently enabled)</li>
</ul>

**Kind**: instance property of [<code>Document</code>](#Document)  
<a name="Document+isActive"></a>

### document.isActive
<p>Returns true when the Document is actively listening
for changes in the firestore back-end.</p>

**Kind**: instance property of [<code>Document</code>](#Document)  
<a name="Document+snapshot"></a>

### document.snapshot
<p>Underlying firestore snapshot.</p>

**Kind**: instance property of [<code>Document</code>](#Document)  
<a name="Document+isLoading"></a>

### document.isLoading
<p>True when new data is being loaded.</p>
<p>Loads are performed in these cases:</p>
<ul>
<li>When real-time updating is started</li>
<li>When a different <code>ref</code> or <code>path</code> is set</li>
<li>When a <code>query</code> is set or cleared</li>
<li>When <code>fetch</code> is explicitely called</li>
</ul>

**Kind**: instance property of [<code>Document</code>](#Document)  
**Example**  
```js
const doc = new Document('albums/splinter', {mode: 'off'});
console.log(doc.isLoading); 	// false
doc.fetch(); 								// start fetch
console.log(doc.isLoading); 	// true
await doc.ready(); 					// wait for fetch to complete
console.log(doc.isLoading); 	// false
```
**Example**  
```js
const doc = new Document('albums/splinter');
console.log(doc.isLoading); 	// false
const dispose = autorun(() => {
  console.log(doc.data);			// start observing document data
});
console.log(doc.isLoading); 	// true
...
dispose();										// stop observing document data
console.log(doc.isLoading); 	// false
```
<a name="Document+update"></a>

### document.update()
<p>Updates one or more fields in the document.</p>
<p>The update will fail if applied to a document that does
not exist.</p>

**Kind**: instance method of [<code>Document</code>](#Document)  
**Example**  
```js
await todoDoc.update({
  finished: true,
  text: 'O yeah, checked this one off',
  foo: {
    bar: 10
  }
});
```
<a name="Document+set"></a>

### document.set(data, [options])
<p>Writes to the document.</p>
<p>If the document does not exist yet, it will be created.
If you pass options, the provided data can be merged into
the existing document.</p>

**Kind**: instance method of [<code>Document</code>](#Document)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | <p>An object of the fields and values for the document</p> |
| [options] | <code>Object</code> | <p>Set behaviour options</p> |
| [options.merge] | <code>Boolean</code> | <p>Set to <code>true</code> to only replace the values specified in the data argument. Fields omitted will remain untouched.</p> |

**Example**  
```js
const todo = new Document('todos/mynewtodo');
await todo.set({
  finished: false,
  text: 'this is awesome'
});
```
<a name="Document+delete"></a>

### document.delete()
<p>Deletes the document in Firestore.</p>
<p>Returns a promise that resolves once the document has been
successfully deleted from the backend (Note that it won't
resolve while you're offline).</p>

**Kind**: instance method of [<code>Document</code>](#Document)  
<a name="Document+fetch"></a>

### document.fetch()
<p>Fetches new data from firestore. Use this to manually fetch
new data when <code>mode</code> is set to 'off'.</p>

**Kind**: instance method of [<code>Document</code>](#Document)  
**Example**  
```js
const doc = new Document('albums/splinter');
await doc.fetch();
console.log('data: ', doc.data);
```
<a name="Document+ready"></a>

### document.ready()
<p>Promise that is resolved when the Document has
data ready to be consumed.</p>
<p>Use this function to for instance wait for
the initial snapshot update to complete, or to wait
for fresh data after changing the path/ref.</p>

**Kind**: instance method of [<code>Document</code>](#Document)  
**Example**  
```js
const doc = new Document('albums/splinter', {mode: 'on'});
await doc.ready();
console.log('data: ', doc.data);
```
**Example**  
```js
const doc = new Document('albums/splinter', {mode: 'on'});
await doc.ready();
...
// Changing the path causes a new snapshot update
doc.path = 'albums/americana';
await doc.ready();
console.log('data: ', doc.data);
```
<a name="Document+addCollectionRef"></a>

### document.addCollectionRef()
<p>ICollectionDocument</p>

**Kind**: instance method of [<code>Document</code>](#Document)  
<a name="Mode"></a>

## Mode
<p>Real-time updating mode.</p>

**Kind**: global variable  
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
import firebase from 'firebase';
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
<a name="mergeUpdateData"></a>

## mergeUpdateData(data, fields) ⇒ <code>Object</code>
<p>Helper function which merges data into the source
and returns the new object.</p>

**Kind**: global function  
**Returns**: <code>Object</code> - <p>Result</p>  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | <p>JSON data</p> |
| fields | <code>Object</code> | <p>JSON data that supports field-paths</p> |

