# Geo Queries

Geo-queries make it possible to query within a certain geographical area.

Although Google has mentioned that they would support Geo-queries out of the
box, this is not yet the case. This means that we developers need to implement
this functionality ourselves in our apps. Firestorter adds support for geo-queries
using the well known [geohash method](https://en.wikipedia.org/wiki/Geohash). A geo-hash is a string that encodes a specific latitude/longitude with a specific precision. Because of how these geo-hashes are encoded, it is possible to efficiently query on geographical regions, even on very large datasets.

## Store a geohash per document

In order to make geo-hash searches possible, each document that you want to search by geographically, needs to contain a geo-hash. The firestorter `GeoQuery` class assumes that each document contains a field named `geohash`, in the root of the document.

When creating or updating a document, encode a location into a geo-hash and store it in the document.

**Example**
```js
import { encodeGeohash, Document } from 'firestorter';

// Encode location into geohash
const geohash = encodeGeohash({
  latitude: 51.3456,
  longitude: 5.67853
});
// By default the geohash is encoded with 10 digits, but you may increase or
// decrease this to change the resolution.

// Store geohash in document
const doc = new Document('cafes/mycafe');
doc.update({
  geohash: geohash
});
```

## Query for documents within a certain region

To query by geographical location, you can use the `GeoQuery` class. The
GeoQuery class takes in a a geographical region and converts this into a 
series of geohash queries. It then aggregates all the results into a single
`docs` array.

**Example**
```js
import { autorun } from 'mobx';
import { GeoQuery } from 'firestorter';

// Determine a search region
const region = {
  latitude: 51.3456,
  longitude: 5.67853,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

// Create query
const geoQuery = new GeoQuery('cafes', {
  region: region
});

// Monitor for query results
autorun(() => {
  console.log(`I found these docs: ${query.docs.map(doc => doc.id)}`);
})
```

## Changing the search region for a query

When for instance building a map application, the search region might change when the user pans or zooms the map. In this case creating a new `GeoQuery` causes all the queries to be re-executed, and all documents to be re-created. In this case it is better to update the `GeoQuery.region` property, which will cause GeoQuery class to fetch only the new queries, and re-use as much of the documents as possible.

**Example**

```js
const geoQuery = new GeoQuery('cafes');

// Function that is called whenever the user changes the map region
function onMapRegionChange(region) {
  geoQuery.region = region;
}
```

## Geo-queries update in real-time!!

As geo-queries are built upon Firestorter Collections and MobX, they are fully real-time by nature. This means that whenever you add a document with a `geohash` to a Firestore collection, it causes the geo-query to automatically return the new result *(\*if the new geohash is included within the queried region that is)*. This is pretty frickin awesome!

## Excluding documents from geo-queries

In order to exclude a document from a geo-query, the `geohash` field needs to be removed or set to an empty string.

Imagine that your document stores both a `location` and a `geohash` field in the document. Removing the `geohash` field will cause it to no longer show up in any geo-query results. If you then want the document to be visible again, just recalculate the `geohash` from the `location` field and update the document.

**Example**

```js
// Remove document from any geo-queries
const doc = new Document('cafes/mycafe');
doc.update({
  geohash: ''
});

// Re-enable geo-queries for the document
const doc = new Document('cafes/mycafe');
await doc.fetch();
doc.update({
  geohash: encodeGeohash(doc.location)
});
```

## Geographical functions

Besides the `GeoQuery` class and `encodeGeohash` functions, firestorter also contains other useful functions for building geo-aware applications (see [API documentation](./api/API.md) for more details).

- `encodeGeohash`
- `decodeGeohash`
- `getGeohashesForRadius`
- `getGeohashesForRegion`
- `flattenGeohashRange`
- `flattenGeohashes`
- `metersToLatitudeDegrees`
- `metersToLongitudeDegrees`
- `calculateGeoDistance`


## See also

- [GeoQuery](./api/GeoQuery.md)
- [Geo functions](./api/GeoFunctions.md)
