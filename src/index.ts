import AggregateCollection from './AggregateCollection';
import Collection from './Collection';
import Document from './Document';
import {
  decodeGeohash,
  encodeGeohash,
  getGeohashesForRadius,
  getGeohashesForRegion,
  flattenGeohashRange,
  flattenGeohashes,
  calculateGeoDistance,
  insideGeoRegion,
  geoRegionToPoints,
  metersToLatitudeDegrees,
  metersToLongitudeDegrees,
} from './GeoHash';
import GeoQuery from './GeoQuery';
import { Mode } from './Types';
import { mergeUpdateData, isTimestamp } from './Utils';
import {
  getFirebase,
  getFirebaseApp,
  getFirestore,
  initFirestorter,
  makeFirestorterContext,
  makeContext, // Deprecated
  IContext,
} from './init';

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
  geoRegionToPoints,
  metersToLatitudeDegrees,
  metersToLongitudeDegrees,
};
