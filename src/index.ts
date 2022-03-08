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
import { getContext, initFirestorter } from './init';

export {
  Collection,
  Document,
  AggregateCollection,
  initFirestorter,
  getContext,
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
export type { IContext, IHasContext } from './init';
export type {
  DocumentSource,
  IDocumentOptions,
  IDocument,
  ICollection,
  CollectionSource,
  CollectionQuery,
  ICollectionOptions,
  ICollectionDocument,
} from './Types';
export type {
  AggregateCollectionOrderBy,
  AggregateCollectionFilterBy,
  IAggregateCollectionQuery,
  AggregateCollectionQueries,
  AggregateCollectionQueriesFn,
  IAggregateCollectionOptions,
} from './AggregateCollection';
export type { IGeoPoint, IGeoRegion, GeoHash } from './GeoHash';
export type { GeoQueryRegion, GeoQueryHash, IGeoQueryQuery, IGeoQueryOptions } from './GeoQuery';
