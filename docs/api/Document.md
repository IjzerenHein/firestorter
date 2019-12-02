<a name="Document"></a>

## Document
<p>Document represents a document stored in the firestore database.
Document is observable so that it can be efficiently linked to for instance
a React Component using <code>mobx-react</code>'s <code>observer</code> pattern. This ensures that
a component is only re-rendered when data that is accessed in the <code>render</code>
function has changed.</p>

**Kind**: global class  

* [Document](#Document)
    * [new Document([source], [options])](#new_Document_new)
    * [.schema](#Document+schema) : <code>function</code>
    * [.data](#Document+data) : <code>Object</code>
    * [.hasData](#Document+hasData) : <code>boolean</code>
    * [.ref](#Document+ref) : <code>firestore.DocumentReference</code> \| <code>function</code>
    * [.id](#Document+id) : <code>string</code>
    * [.path](#Document+path) : <code>string</code> \| <code>function</code>
    * [.mode](#Document+mode) : <code>string</code>
    * [.isActive](#Document+isActive) : <code>boolean</code>
    * [.snapshot](#Document+snapshot) : <code>firestore.DocumentSnapshot</code>
    * [.isLoading](#Document+isLoading) : <code>boolean</code>
    * [.isLoaded](#Document+isLoaded) : <code>boolean</code>
    * [.update(fields)](#Document+update) ⇒ <code>Promise</code>
    * [.set(data, [options])](#Document+set) ⇒ <code>Promise</code>
    * [.delete()](#Document+delete) ⇒ <code>Promise</code>
    * [.fetch()](#Document+fetch) ⇒ <code>Promise</code>
    * [.ready()](#Document+ready) ⇒ <code>Promise</code>

<a name="new_Document_new"></a>

### new Document([source], [options])

| Param | Type | Description |
| --- | --- | --- |
| [source] | <code>DocumentSource</code> | <p>String-path, ref or function that returns a path or ref</p> |
| [options] | <code>Object</code> | <p>Configuration options</p> |
| [options.mode] | <code>String</code> | <p>See <code>Document.mode</code> (default: auto)</p> |
| [options.schema] | <code>function</code> | <p>Superstruct schema for data validation</p> |
| [options.snapshot] | <code>firestore.DocumentSnapshot</code> | <p>Initial document snapshot</p> |
| [options.snapshotOptions] | <code>firestore.SnapshotOptions</code> | <p>Options that configure how data is retrieved from a snapshot</p> |
| [options.debug] | <code>boolean</code> | <p>Enables debug logging</p> |
| [options.debugName] | <code>String</code> | <p>Name to use when debug logging is enabled</p> |

<a name="Document+schema"></a>

### document.schema : <code>function</code>
<p>Returns the superstruct schema used to validate the
document, or undefined.</p>

**Kind**: instance property of [<code>Document</code>](#Document)  
<a name="Document+data"></a>

### document.data : <code>Object</code>
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
<a name="Document+hasData"></a>

### document.hasData : <code>boolean</code>
<p>True whenever the document has fetched any data.</p>

**Kind**: instance property of [<code>Document</code>](#Document)  
<a name="Document+ref"></a>

### document.ref : <code>firestore.DocumentReference</code> \| <code>function</code>
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

### document.id : <code>string</code>
<p>Id of the firestore document.</p>
<p>To get the full-path of the document, use <code>path</code>.</p>

**Kind**: instance property of [<code>Document</code>](#Document)  
<a name="Document+path"></a>

### document.path : <code>string</code> \| <code>function</code>
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

### document.mode : <code>string</code>
<p>Real-time updating mode.</p>
<p>Can be set to any of the following values:</p>
<ul>
<li>&quot;auto&quot; (enables real-time updating when the document becomes observed)</li>
<li>&quot;off&quot; (no real-time updating, you need to call fetch explicitly)</li>
<li>&quot;on&quot; (real-time updating is permanently enabled)</li>
</ul>

**Kind**: instance property of [<code>Document</code>](#Document)  
<a name="Document+isActive"></a>

### document.isActive : <code>boolean</code>
<p>Returns true when the Document is actively listening
for changes in the firestore back-end.</p>

**Kind**: instance property of [<code>Document</code>](#Document)  
<a name="Document+snapshot"></a>

### document.snapshot : <code>firestore.DocumentSnapshot</code>
<p>Underlying firestore snapshot.</p>

**Kind**: instance property of [<code>Document</code>](#Document)  
<a name="Document+isLoading"></a>

### document.isLoading : <code>boolean</code>
<p>True when new data is being loaded.</p>
<p>Loads are performed in these cases:</p>
<ul>
<li>When real-time updating is started</li>
<li>When a different <code>ref</code> or <code>path</code> is set</li>
<li>When a <code>query</code> is set or cleared</li>
<li>When <code>fetch</code> is explicitly called</li>
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
<a name="Document+isLoaded"></a>

### document.isLoaded : <code>boolean</code>
<p>True when a snapshot has been obtained from the Firestore
back-end. This property indicates whether an initial fetch/get call
to Firestore has completed processing. This doesn't however mean that data
is available, as the returned snapshot may contain a value indicating
that the document doesn't exist. Use <code>hasData</code> to check whether any
data was succesfully retrieved.</p>

**Kind**: instance property of [<code>Document</code>](#Document)  
<a name="Document+update"></a>

### document.update(fields) ⇒ <code>Promise</code>
<p>Updates one or more fields in the document.</p>
<p>The update will fail if applied to a document that does
not exist.</p>

**Kind**: instance method of [<code>Document</code>](#Document)  

| Param | Type | Description |
| --- | --- | --- |
| fields | <code>Object</code> | <p>Fields to update</p> |

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

### document.set(data, [options]) ⇒ <code>Promise</code>
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

### document.delete() ⇒ <code>Promise</code>
<p>Deletes the document in Firestore.</p>
<p>Returns a promise that resolves once the document has been
successfully deleted from the backend (Note that it won't
resolve while you're offline).</p>

**Kind**: instance method of [<code>Document</code>](#Document)  
<a name="Document+fetch"></a>

### document.fetch() ⇒ <code>Promise</code>
<p>Fetches new data from firestore. Use this to manually fetch
new data when <code>mode</code> is set to 'off'.</p>

**Kind**: instance method of [<code>Document</code>](#Document)  
**Fullfil**: <code>Document&lt;T&gt;</code> This document  
**Example**  
```js
const doc = new Document('albums/splinter');
await doc.fetch();
console.log('data: ', doc.data);
```
<a name="Document+ready"></a>

### document.ready() ⇒ <code>Promise</code>
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
