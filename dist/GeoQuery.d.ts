import AggregateCollection, { IAggregateCollectionOptions, IAggregateCollectionQuery, AggregateCollectionQueriesFn } from './AggregateCollection';
import { IGeoRegion } from './GeoHash';
import { CollectionSource, ICollectionDocument } from './Types';
export declare type GeoQueryRegion = IGeoRegion | (() => IGeoRegion | void);
export declare type GeoQueryHash = string[];
export interface IGeoQueryQuery extends IAggregateCollectionQuery {
    geohash: GeoQueryHash;
}
export interface IGeoQueryOptions<T> extends Omit<IAggregateCollectionOptions<T, IGeoQueryQuery>, 'queries'> {
    queries?: AggregateCollectionQueriesFn<IGeoQueryQuery>;
    region?: GeoQueryRegion;
    fieldPath?: string;
    filterBy?: (doc: T, region?: IGeoRegion | void) => boolean;
}
/**
 * GeoQuery makes it possible to perform efficient geographical based queries
 * with the use of geo-hashes.
 *
 * In order to use GeoQuery, each document needs a `geohash` field stored in the
 * root of the document. The value of the `geohash` field should be a geo-hash
 * encoded using `encodeGeohash`.
 *
 * @extends AggregateCollection
 * @param {CollectionSource} [source] String-path, ref or function that returns a path or ref
 * @param {Object} [options] Configuration options
 * @param {IGeoRegion} [options.region] See `GeoQuery.region`
 * @param {string} [options.fieldPath] Field to query on (default = `geohash`)
 *
 * @example
 *
 * const query = new GeoQuery('bookings', {
 *   region = {
 *     latitude: 51.45663,
 *     longitude: 5.223,
 *     latitudeDelta: 0.1,
 *     longitudeDelta: 0.1,
 *   }
 * });
 *
 * // Bookings needs to contain documents with a `geohash`
 * // field in the root, like this:
 * // {
 * //   ...
 * //   geohash: 'jhdb23'
 * //   ...
 * // }
 *
 * autorun(() => {
 *   query.docs.map(doc => console.log('doc: ', doc.id, doc.data));
 * });
 */
declare class GeoQuery<T extends ICollectionDocument> extends AggregateCollection<T, IGeoQueryQuery> {
    private regionObservable;
    constructor(source: CollectionSource, options?: IGeoQueryOptions<T>);
    /**
     * Geographical region to query for.
     *
     * Use this property to get or set the region in which
     * to perform a aggregate geohash query.
     *
     * @type {GeoQueryRegion}
     *
     * @example
     * const query = new GeoQuery('bookings');
     *
     * // Bookings needs to contain documents with a `geohash`
     * // field in the root, like this:
     * // {
     * //   ...
     * //   geohash: 'jhdb23'
     * //   ...
     * // }
     *
     * ...
     * // Set the region to query for
     * query.region = {
     *   latitude: 51.45663,
     *   longitude: 5.223,
     *   latitudeDelta: 0.1,
     *   longitudeDelta: 0.1,
     * }
     */
    get region(): GeoQueryRegion | void;
    set region(val: GeoQueryRegion | void);
    /**
     * Geo-hashes that are queries for the given region.
     *
     * @type {GeoQueryHash[]}
     *
     * @example
     * const query = new GeoQuery('bookings', {
     *   region: {
     *     latitude: 51.45663,
     *     longitude: 5.223,
     *     latitudeDelta: 0.1,
     *     longitudeDelta: 0.1
     *   }
     * });
     * ...
     * // Get the in-use geohashes
     * console.log(query.geohashes);
     * // [['todo', 'todo2], ...]
     */
    get geohashes(): GeoQueryHash[];
}
export default GeoQuery;
