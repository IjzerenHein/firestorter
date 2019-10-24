import Collection from "./Collection";
import Document from "./Document";
import AggregateCollection from "./AggregateCollection";
import GeoQuery from "./GeoQuery";
import {
	decodeGeohash,
	encodeGeohash,
	getGeohashesForRadius,
	getGeohashesForRegion,
	flattenGeohashes,
	calculateGeoDistance
} from "./GeoHash";
import { Mode } from "./Types";
import {
	getFirebase,
	getFirebaseApp,
	getFirestore,
	initFirestorter,
	makeContext,
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
	makeContext,
	IContext,
	// Geo queries
	GeoQuery,
	decodeGeohash,
	encodeGeohash,
	getGeohashesForRadius,
	getGeohashesForRegion,
	flattenGeohashes,
	calculateGeoDistance
};
