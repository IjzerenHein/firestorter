<a name="GeoQuery"></a>

## GeoQuery ⇐ <code>AggregateCollection</code>
<p>GeoQuery makes it possible to perform efficient geographical based queries
with the use of geo-hashes.</p>
<p>In order to use GeoQuery, each document needs a <code>geohash</code> field stored in the
root of the document. The value of the <code>geohash</code> field should be a geo-hash
encoded using <code>encodeGeohash</code>.</p>

**Kind**: global class  
**Extends**: <code>AggregateCollection</code>  

* [GeoQuery](#GeoQuery) ⇐ <code>AggregateCollection</code>
    * [new GeoQuery([source], [options])](#new_GeoQuery_new)
    * [.region](#GeoQuery+region) : <code>GeoQueryRegion</code>
    * [.geohashes](#GeoQuery+geohashes) : <code>Array.&lt;GeoQueryHash&gt;</code>

<a name="new_GeoQuery_new"></a>

### new GeoQuery([source], [options])

| Param | Type | Description |
| --- | --- | --- |
| [source] | <code>CollectionSource</code> | <p>String-path, ref or function that returns a path or ref</p> |
| [options] | <code>Object</code> | <p>Configuration options</p> |
| [options.region] | <code>IGeoRegion</code> | <p>See <code>GeoQuery.region</code></p> |
| [options.fieldPath] | <code>string</code> | <p>Field to query on (default = <code>geohash</code>)</p> |

**Example**  
```js
const query = new GeoQuery('bookings', {
  region = {
    latitude: 51.45663,
    longitude: 5.223,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  }
});

// Bookings needs to contain documents with a `geohash`
// field in the root, like this:
// {
//   ...
//   geohash: 'jhdb23'
//   ...
// }

autorun(() => {
  query.docs.map(doc => console.log('doc: ', doc.id, doc.data));
});
```
<a name="GeoQuery+region"></a>

### geoQuery.region : <code>GeoQueryRegion</code>
<p>Geographical region to query for.</p>
<p>Use this property to get or set the region in which
to perform a aggregate geohash query.</p>

**Kind**: instance property of [<code>GeoQuery</code>](#GeoQuery)  
**Example**  
```js
const query = new GeoQuery('bookings');

// Bookings needs to contain documents with a `geohash`
// field in the root, like this:
// {
//   ...
//   geohash: 'jhdb23'
//   ...
// }

...
// Set the region to query for
query.region = {
  latitude: 51.45663,
  longitude: 5.223,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
}
```
<a name="GeoQuery+geohashes"></a>

### geoQuery.geohashes : <code>Array.&lt;GeoQueryHash&gt;</code>
<p>Geo-hashes that are queries for the given region.</p>

**Kind**: instance property of [<code>GeoQuery</code>](#GeoQuery)  
**Example**  
```js
const query = new GeoQuery('bookings', {
  region: {
    latitude: 51.45663,
    longitude: 5.223,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1
  }
});
...
// Get the in-use geohashes
console.log(query.geohashes);
// [['todo', 'todo2], ...]
```
