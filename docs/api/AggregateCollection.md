<a name="AggregateCollection"></a>

## AggregateCollection
<p>Collection that aggregates documents resulting from multiple queries made to a single collection into
a single, easy accessible collection.</p>

<p>AggregateCollection is driven by the <code>queries</code> function, which defines what
queries should be executed on the Firestore cloud back-end. GeoQuery is
for instance a more specific use-case of a aggregated-collection using a range
of geo-hash queries.</p>

**Kind**: global class  

* [AggregateCollection](#AggregateCollection)
    * [new AggregateCollection([source], [options])](#new_AggregateCollection_new)
    * [.docs](#AggregateCollection+docs) : <code>Array</code>
    * [.hasDocs](#AggregateCollection+hasDocs) : <code>boolean</code>
    * [.cols](#AggregateCollection+cols) : <code>Array</code>
    * [.queries](#AggregateCollection+queries) : <code>function</code>
    * [.isLoading](#AggregateCollection+isLoading) : <code>boolean</code>

<a name="new_AggregateCollection_new"></a>

### new AggregateCollection([source], [options])

| Param | Type | Description |
| --- | --- | --- |
| [source] | <code>CollectionSource</code> | <p>String-path, ref or function that returns a path or ref</p> |
| [options] | <code>Object</code> | <p>Configuration options</p> |
| [options.queries] | <code>AggregateCollectionQueriesFn</code> | <p>See <code>AggregateCollection.queries</code></p> |
| [options.createDocument] | <code>function</code> | <p>Factory function for creating documents <code>(source, options) =&gt; new Document(source, options)</code></p> |
| [options.orderBy] | <code>function</code> | <p>Client side sort function</p> |
| [options.filterBy] | <code>function</code> | <p>Client side filter function</p> |
| [options.debug] | <code>boolean</code> | <p>Enables debug logging</p> |
| [options.debugName] | <code>String</code> | <p>Name to use when debug logging is enabled</p> |

**Example**  
```js
import {AggregateCollection} from 'firestorter';

// Query all unfinished todos for a set of users
const userIds = ['pinky', 'brain'];
const col = new AggregateCollection('todos', {
  queries: () => userIds.map(userId => ({
    key: userId, // unique-key by which the query is re-used/cached
    query: (ref) => ref.where('userId', '==', userId).where('finished', '==', false)
  }))
});
```
<a name="AggregateCollection+docs"></a>

### aggregateCollection.docs : <code>Array</code>
<p>Array of all the documents that have been fetched
from firestore.</p>

**Kind**: instance property of [<code>AggregateCollection</code>](#AggregateCollection)  
**Example**  
```js
aggregateCollection.docs.forEach((doc) => {
  console.log(doc.data);
});
```
<a name="AggregateCollection+hasDocs"></a>

### aggregateCollection.hasDocs : <code>boolean</code>
<p>True whenever any documents have been fetched.</p>

**Kind**: instance property of [<code>AggregateCollection</code>](#AggregateCollection)  
<a name="AggregateCollection+cols"></a>

### aggregateCollection.cols : <code>Array</code>
<p>Array of all the collections inside this aggregate
collection.</p>

**Kind**: instance property of [<code>AggregateCollection</code>](#AggregateCollection)  
**Example**  
```js
aggregateCollection.cols.forEach((col) => {
  console.log(col.docs.length);
});
```
<a name="AggregateCollection+queries"></a>

### aggregateCollection.queries : <code>function</code>
<p>Queries function.</p>

**Kind**: instance property of [<code>AggregateCollection</code>](#AggregateCollection)  
<a name="AggregateCollection+isLoading"></a>

### aggregateCollection.isLoading : <code>boolean</code>
<p>True when new data is being loaded.</p>

**Kind**: instance property of [<code>AggregateCollection</code>](#AggregateCollection)  
