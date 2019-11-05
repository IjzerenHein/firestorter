# API documentation

| Classes                                             | Description                                                                                                    |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| [Document](./api/Document.md)                       | Document represents a document stored in the firestore database.                                               |
| [Collection](./api/Collection.md)                   | Collection represents a collection of documents stored in the firestore database.                              |
| [AggregateCollection](./api/AggregateCollection.md) | Collection that aggregates the documents of one or more collections into a single, easy accessible collection. |
| [GeoQuery](./api/GeoQuery.md)                       | GeoQuery makes it possible to perform efficient geographical based queries with the use of geo-hashes.         |


| Functions                                                               | Description                                                                                           |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [initFirestorter](./api/InitFunctions.md#initfirestorterconfig)         | Initializes firestorter with the firebase-app.                                                        |
| [makeFirestorterContext](./api/InitFunctions.md#makefirestortercontext) | Initializes firestorter with the firebase-app.                                                        |
| [mergeUpdateData](./api/UtilityFunctions.md#mergeupdatedata)            | Helper function which merges firestore update field data and returns the new object.                  |
| [isTimestamp](./api/UtilityFunctions.md#istimestamp)                    | Schema helper function that checks whether the provided value is a valid Firestore Timestamp or Date. |


| Geo functions                                                              | Description                                                                                 |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [encodeGeohash](./api/GeoFunctions.md#encodegeohash)                       | Encodes a geographical position (latitude/longitude) into a geohash tile.                   |
| [decodeGeohash](./api/GeoFunctions.md#decodegeohash)                       | Decodes a geohash tile into a geographical position (latitude/longitude).                   |
| [metersToLongitudeDegrees](./api/GeoFunctions.md#meterstolongitudedegrees) | Calculates the number of longitude degrees, over a given distance and at a given latitude.  |
| [metersToLatitudeDegrees](./api/GeoFunctions.md#meterstolatitudedegrees)   | Calculates the number of latitude degrees over a given distance.                            |
| [getGeohashesForRadius](./api/GeoFunctions.md#getgeohashesforradius)       | Calculates a set of geohash queries to fully contain a given circle.                        |
| [getGeohashesForRegion](./api/GeoFunctions.md#getgeohashesforregion)       | Calculates a set of geohash queries to fully contain a given region box.                    |
| [flattenGeohashRange](./api/GeoFunctions.md#flattengeohashrange)           | Flattens a geohash query start- and end-geohash into all its individual geohash components. |
| [flattenGeohashes](./api/GeoFunctions.md#flattengeohashes)                 | Flattens a set of geohash queries into a single array of geohash tiles.                     |
| [calculateGeoDistance](./api/GeoFunctions.md#calculategeodistance)         | Calculates the distance between two locations in meters.                                    |

