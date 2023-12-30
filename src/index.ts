import AggregateCollection from './AggregateCollection.js';
import Collection from './Collection.js';
import Document from './Document.js';
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
} from './GeoHash.js';
import GeoQuery from './GeoQuery.js';
import { Mode } from './Types.js';
import { mergeUpdateData, isTimestamp } from './Utils.js';

export * from './init.js';
export * from './compat.js';
// export * from './init/web.js'; // <-- This one might causes problems on RN

export {
  Collection,
  Document,
  AggregateCollection,
  mergeUpdateData,
  Mode,
  isTimestamp,
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
export type {
  DocumentSource,
  IDocumentOptions,
  IDocument,
  ICollection,
  CollectionSource,
  CollectionQuery,
  ICollectionOptions,
  ICollectionDocument,
  IContext,
  IHasContext,
} from './Types.js';
export type {
  AggregateCollectionOrderBy,
  AggregateCollectionFilterBy,
  IAggregateCollectionQuery,
  AggregateCollectionQueries,
  AggregateCollectionQueriesFn,
  IAggregateCollectionOptions,
} from './AggregateCollection.js';
export type { IGeoPoint, IGeoRegion, GeoHash } from './GeoHash.js';
export type { GeoQueryRegion, GeoQueryHash, IGeoQueryQuery, IGeoQueryOptions } from './GeoQuery.js';

export const ModuleName = 'firestorter';
