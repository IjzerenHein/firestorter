<a name="Collection"></a>

## Collection
<p>The Collection class lays at the heart of <code>firestorter</code>.
It represents a collection in Firestore and its queried data. It is
observable so that it can be efficiently linked to a React Component
using <code>mobx-react</code>'s <code>observer</code> pattern.</p>
<p>Collection supports three modes of real-time updating:</p>
<ul>
<li>&quot;auto&quot; (real-time updating is enabled on demand) (default)</li>
<li>&quot;on&quot; (real-time updating is permanently turned on)</li>
<li>&quot;off&quot; (real-time updating is turned off, use <code>.fetch</code> explicitly)</li>
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
    * [new Collection([source], [options])](#new_Collection_new)
    * [.docs](#Collection+docs) : <code>Array</code>
    * [.hasDocs](#Collection+hasDocs) : <code>boolean</code>
    * [.ref](#Collection+ref) : <code>firestore.CollectionReference</code> \| <code>function</code>
    * [.id](#Collection+id) : <code>string</code>
    * [.path](#Collection+path) : <code>string</code> \| <code>function</code>
    * [.query](#Collection+query) : <code>firestore.Query</code> \| <code>function</code>
    * [.mode](#Collection+mode) : <code>string</code>
    * [.isActive](#Collection+isActive) : <code>boolean</code>
    * [.isLoading](#Collection+isLoading) : <code>boolean</code>
    * [.fetch()](#Collection+fetch) ⇒ <code>Promise</code>
    * [.ready()](#Collection+ready) ⇒ <code>Promise</code>
    * [.add(data)](#Collection+add) ⇒ <code>Promise</code>

<a name="new_Collection_new"></a>

### new Collection([source], [options])

| Param | Type | Description |
| --- | --- | --- |
| [source] | <code>CollectionSource</code> | <p>String-path, ref or function that returns a path or ref</p> |
| [options] | <code>Object</code> | <p>Configuration options</p> |
| [options.query] | <code>function</code> \| <code>Query</code> | <p>See <code>Collection.query</code></p> |
| [options.mode] | <code>String</code> | <p>See <code>Collection.mode</code></p> |
| [options.createDocument] | <code>function</code> | <p>Factory function for creating documents <code>(source, options) =&gt; new Document(source, options)</code></p> |
| [options.minimizeUpdates] | <code>boolean</code> | <p>Enables additional algorithms to reduces updates to your app (e.g. when snapshots are received in rapid succession)</p> |
| [options.debug] | <code>boolean</code> | <p>Enables debug logging</p> |
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
// In manual mode, just call `fetch` explicitly
const col = new Collection('albums', {mode: 'off'});
col.fetch().then((collection) => {
  collection.docs.forEach((doc) => console.log(doc));
});

// Yo can use the `isLoading` property to see whether a fetch
// is in progress
console.log(col.isLoading);
```
<a name="Collection+docs"></a>

### collection.docs : <code>Array</code>
<p>Array of all the documents that have been fetched
from firestore.</p>

**Kind**: instance property of [<code>Collection</code>](#Collection)  
**Example**  
```js
collection.docs.forEach((doc) => {
  console.log(doc.data);
});
```
<a name="Collection+hasDocs"></a>

### collection.hasDocs : <code>boolean</code>
<p>True whenever the docs array is not empty.</p>

**Kind**: instance property of [<code>Collection</code>](#Collection)  
<a name="Collection+ref"></a>

### collection.ref : <code>firestore.CollectionReference</code> \| <code>function</code>
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

### collection.id : <code>string</code>
<p>Id of the Firestore collection (e.g. 'tracks').</p>
<p>To get the full-path of the collection, use <code>path</code>.</p>

**Kind**: instance property of [<code>Collection</code>](#Collection)  
<a name="Collection+path"></a>

### collection.path : <code>string</code> \| <code>function</code>
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

### collection.query : <code>firestore.Query</code> \| <code>function</code>
<p>Use this property to set any order-by, where,
limit or start/end criteria. When set, that query
is used to retrieve any data. When cleared (<code>undefined</code>),
the collection reference is used.</p>
<p>The query can be a Function of the form
<code>(firestore.CollectionReference) =&gt; firestore.Query | null | undefined</code>.
Where returning <code>null</code> will result in an empty collection,
and returning <code>undefined</code> will revert to using the collection
reference (the entire collection).</p>
<p>If the query function makes use of any observable values then
it will be re-run when those values change.</p>
<p>query can be set to a direct Firestore <code>Query</code> object but this
is an uncommon usage.</p>

**Kind**: instance property of [<code>Collection</code>](#Collection)  
**Example**  
```js
const todos = new Collection('todos');

// Sort the collection
todos.query = (ref) => ref.orderBy('text', 'asc');

// Order, filter & limit
todos.query = (ref) => ref.where('finished', '==', false).orderBy('finished', 'asc').limit(20);

// React to changes in observable and force empty collection when required
todos.query = (ref) => authStore.uid ? ref.where('owner', '==', authStore.uid) : null;

// Clear the query, will cause whole collection to be fetched
todos.query = undefined;
```
<a name="Collection+mode"></a>

### collection.mode : <code>string</code>
<p>Real-time updating mode.</p>
<p>Can be set to any of the following values:</p>
<ul>
<li>&quot;auto&quot; (enables real-time updating when the collection is observed)</li>
<li>&quot;off&quot; (no real-time updating, you need to call fetch explicitly)</li>
<li>&quot;on&quot; (real-time updating is permanently enabled)</li>
</ul>

**Kind**: instance property of [<code>Collection</code>](#Collection)  
<a name="Collection+isActive"></a>

### collection.isActive : <code>boolean</code>
<p>Returns true when the Collection is actively listening
for changes in the firestore back-end.</p>

**Kind**: instance property of [<code>Collection</code>](#Collection)  
<a name="Collection+isLoading"></a>

### collection.isLoading : <code>boolean</code>
<p>True when new data is being loaded.</p>
<p>Fetches are performed in these cases:</p>
<ul>
<li>When real-time updating is started</li>
<li>When a different <code>ref</code> or <code>path</code> is set</li>
<li>When a <code>query</code> is set or cleared</li>
<li>When <code>fetch</code> is explicitly called</li>
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

### collection.fetch() ⇒ <code>Promise</code>
<p>Fetches new data from firestore. Use this to manually fetch
new data when <code>mode</code> is set to 'off'.</p>

**Kind**: instance method of [<code>Collection</code>](#Collection)  
**Fulfil**: [<code>Collection</code>](#Collection) - This collection  
**Reject**: <code>Error</code> - Error describing the cause of the problem  
**Example**  
```js
const col = new Collection('albums', 'off');
col.fetch().then(({docs}) => {
  docs.forEach(doc => console.log(doc));
});
```
<a name="Collection+ready"></a>

### collection.ready() ⇒ <code>Promise</code>
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

### collection.add(data) ⇒ <code>Promise</code>
<p>Add a new document to this collection with the specified
data, assigning it a document ID automatically.</p>

**Kind**: instance method of [<code>Collection</code>](#Collection)  
**Fulfil**: <code>Document</code> - The newly created document  
**Reject**: <code>Error</code> - Error, e.g. a schema validation error or Firestore error  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | <p>JSON data for the new document</p> |

**Example**  
```js
const doc = await collection.add({
  finished: false,
  text: 'New todo',
  options: {
    highPrio: true
  }
});
console.log(doc.id); // print id of new document
```
**Example**  
```js
// If you want to create a document with a custom Id, then
// use the Document class instead, like this
const docWithCustomId = new Document('todos/mytodoid');
await docWithCustomId.set({
  finished: false,
  text: 'New todo',
});
```
