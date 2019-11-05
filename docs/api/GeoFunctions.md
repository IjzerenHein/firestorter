## Functions

<dl>
<dt><a href="#encodeGeohash">encodeGeohash(location, [precision])</a> ⇒</dt>
<dd><p>Encodes a geographical position (latitude/longitude) into a geohash tile.</p></dd>
<dt><a href="#decodeGeohash">decodeGeohash(geohash)</a></dt>
<dd><p>Decodes a geohash tile into a geographical position (latitude/longitude).</p></dd>
<dt><a href="#metersToLongitudeDegrees">metersToLongitudeDegrees(distance, latitude)</a> ⇒</dt>
<dd><p>Calculates the number of longitude degrees over a given distance and at a given latitude.</p></dd>
<dt><a href="#metersToLatitudeDegrees">metersToLatitudeDegrees(distance)</a> ⇒</dt>
<dd><p>Calculates the number of latitude degrees over a given distance.</p></dd>
<dt><a href="#getGeohashesForRadius">getGeohashesForRadius(center, radius)</a> ⇒</dt>
<dd><p>Calculates a set of geohash queries to fully contain a given circle. A query is a [start, end] pair
where any geohash is guaranteed to be lexiographically larger then start and smaller than end.</p></dd>
<dt><a href="#getGeohashesForRegion">getGeohashesForRegion(region)</a> ⇒</dt>
<dd><p>Calculates a set of geohash queries to fully contain a given region box. A query is a [start, end] pair
where any geohash is guaranteed to be lexiographically larger then start and smaller than end.</p></dd>
<dt><a href="#flattenGeohashRange">flattenGeohashRange(geohash1, geohash2)</a></dt>
<dd><p>Flattens a query start-geohash; and end-geohash into all its individual geohash components.</p></dd>
<dt><a href="#flattenGeohashes">flattenGeohashes(geohashes)</a></dt>
<dd><p>Flattens a set of geo-hash queries into a single array of geohash tiles.</p></dd>
<dt><a href="#calculateGeoDistance">calculateGeoDistance(location1, location2)</a> ⇒</dt>
<dd><p>Method which calculates the distance, in meters, between two locations,
via the Haversine formula. Note that this is approximate due to the fact that the
Earth's radius varies between 6356.752 km and 6378.137 km.</p></dd>
</dl>

<a name="encodeGeohash"></a>

## encodeGeohash(location, [precision]) ⇒
<p>Encodes a geographical position (latitude/longitude) into a geohash tile.</p>

**Kind**: global function  
**Returns**: <p>The geohash of the inputted location.</p>  

| Param | Type | Description |
| --- | --- | --- |
| location | <code>object</code> | <p>The {latitude, longitude} to encode into a geohash.</p> |
| [precision] | <code>number</code> | <p>The length of the geohash to create. If no precision is specified, the default precision of <code>10</code> is used.</p> |

<a name="decodeGeohash"></a>

## decodeGeohash(geohash)
<p>Decodes a geohash tile into a geographical position (latitude/longitude).</p>

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| geohash | <code>string</code> | <p>Geohash tile</p> |

<a name="metersToLongitudeDegrees"></a>

## metersToLongitudeDegrees(distance, latitude) ⇒
<p>Calculates the number of longitude degrees over a given distance and at a given latitude.</p>

**Kind**: global function  
**Returns**: <p>The number of degrees the distance corresponds to.</p>  

| Param | Type | Description |
| --- | --- | --- |
| distance | <code>number</code> | <p>The distance to convert.</p> |
| latitude | <code>number</code> | <p>The latitude at which to calculate.</p> |

<a name="metersToLatitudeDegrees"></a>

## metersToLatitudeDegrees(distance) ⇒
<p>Calculates the number of latitude degrees over a given distance.</p>

**Kind**: global function  
**Returns**: <p>The number of degrees the distance corresponds to.</p>  

| Param | Type | Description |
| --- | --- | --- |
| distance | <code>number</code> | <p>The distance to convert.</p> |

<a name="getGeohashesForRadius"></a>

## getGeohashesForRadius(center, radius) ⇒
<p>Calculates a set of geohash queries to fully contain a given circle. A query is a [start, end] pair
where any geohash is guaranteed to be lexiographically larger then start and smaller than end.</p>

**Kind**: global function  
**Returns**: <p>An array of geohashes containing a [start, end] pair.</p>  

| Param | Type | Description |
| --- | --- | --- |
| center | <code>object</code> | <p>The center given as {latitude, longitude}.</p> |
| radius | <code>number</code> | <p>The radius of the circle in meters.</p> |

<a name="getGeohashesForRegion"></a>

## getGeohashesForRegion(region) ⇒
<p>Calculates a set of geohash queries to fully contain a given region box. A query is a [start, end] pair
where any geohash is guaranteed to be lexiographically larger then start and smaller than end.</p>

**Kind**: global function  
**Returns**: <p>An array of geohashes containing a [start, end] pair.</p>  

| Param | Type | Description |
| --- | --- | --- |
| region | <code>object</code> | <p>The region given as {latitude, longitude, latitudeDelta, longitudeDelta}.</p> |

<a name="flattenGeohashRange"></a>

## flattenGeohashRange(geohash1, geohash2)
<p>Flattens a query start-geohash; and end-geohash into all its individual geohash components.</p>

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| geohash1 | <code>string</code> | <p>The geohash from range</p> |
| geohash2 | <code>string</code> | <p>The geohash to range</p> |

<a name="flattenGeohashes"></a>

## flattenGeohashes(geohashes)
<p>Flattens a set of geo-hash queries into a single array of geohash tiles.</p>

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| geohashes | <code>Array.&lt;Array.&lt;string&gt;&gt;</code> | <p>The geohashes array</p> |

<a name="calculateGeoDistance"></a>

## calculateGeoDistance(location1, location2) ⇒
<p>Method which calculates the distance, in meters, between two locations,
via the Haversine formula. Note that this is approximate due to the fact that the
Earth's radius varies between 6356.752 km and 6378.137 km.</p>

**Kind**: global function  
**Returns**: <p>The distance, in meters, between the inputted locations.</p>  

| Param | Type | Description |
| --- | --- | --- |
| location1 | <code>object</code> | <p>The {latitude, longitude} of the first location.</p> |
| location2 | <code>object</code> | <p>The {latitude, longitude} of the second location.</p> |

