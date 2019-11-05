import Collection from "./Collection";
import Document from "./Document";
import AggregateCollection from "./AggregateCollection";
import GeoQuery from "./GeoQuery";
import {
	decodeGeohash,
	encodeGeohash,
	getGeohashesForRadius,
	getGeohashesForRegion,
	flattenGeohashRange,
	flattenGeohashes,
	calculateGeoDistance,
	insideGeoRegion,
	metersToLatitudeDegrees,
	metersToLongitudeDegrees
} from "./GeoHash";
import { Mode } from "./Types";
import {
	getFirebase,
	getFirebaseApp,
	getFirestore,
	initFirestorter,
	makeFirestorterContext,
	makeContext, // Deprecated
	IContext
} from "./init";
import { mergeUpdateData, isTimestamp } from "./Utils";

export {
	Collection,
	Document,
	AggregateCollection,
	initFirestorter,
	getFirestore,
	getFirebase,
	getFirebaseApp,
	mergeUpdateData,
	Mode,
	isTimestamp,
	makeFirestorterContext,
	makeContext, // Deprecated
	IContext,
	// Geo queries
	GeoQuery,
	decodeGeohash,
	encodeGeohash,
	getGeohashesForRadius,
	getGeohashesForRegion,
	flattenGeohashRange,
	flattenGeohashes,
	calculateGeoDistance,
	insideGeoRegion,
	metersToLatitudeDegrees,
	metersToLongitudeDegrees
};
