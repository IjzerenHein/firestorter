export interface IGeoPoint {
    readonly latitude: number;
    readonly longitude: number;
}
export interface IGeoRegion extends IGeoPoint {
    readonly latitudeDelta: number;
    readonly longitudeDelta: number;
}
export declare type GeoHash = string;
/**
 * Converts a region into its geo points (nortEast, southWest, etc..).
 *
 * @param {IGeoRegion} region The region to convert
 */
export declare function geoRegionToPoints(region: IGeoRegion): {
    northEast: IGeoPoint;
    northWest: IGeoPoint;
    southEast: IGeoPoint;
    southWest: IGeoPoint;
};
/**
 * Encodes a geographical position (latitude/longitude) into a geohash tile.
 *
 * @param {object} location The {latitude, longitude} to encode into a geohash.
 * @param {number} [precision] The length of the geohash to create. If no precision is specified, the
 * default precision of `10` is used.
 * @returns The geohash of the inputted location.
 */
export declare function encodeGeohash(location: IGeoPoint, precision?: number): string;
/**
 * Decodes a geohash tile into a geographical position (latitude/longitude).
 *
 * @param {string} geohash - Geohash tile
 */
export declare function decodeGeohash(geohash: string): IGeoPoint[];
/**
 * Calculates the number of longitude degrees over a given distance and at a given latitude.
 *
 * @param {number} distance The distance to convert.
 * @param {number} latitude The latitude at which to calculate.
 * @returns The number of degrees the distance corresponds to.
 */
export declare function metersToLongitudeDegrees(distance: number, latitude: number): number;
/**
 * Calculates the number of latitude degrees over a given distance.
 *
 * @param {number} distance The distance to convert.
 * @returns The number of degrees the distance corresponds to.
 */
export declare function metersToLatitudeDegrees(distance: number): number;
/**
 * Calculates the bits necessary to reach a given resolution, in meters, for the longitude at a
 * given latitude.
 * @ignore
 * @param {number} resolution The desired resolution.
 * @param {number} latitude The latitude used in the conversion.
 * @return The bits necessary to reach a given resolution, in meters.
 */
export declare function longitudeBitsForResolution(resolution: number, latitude: number): number;
/**
 * Calculates the bits necessary to reach a given resolution, in meters, for the latitude.
 * @ignore
 * @param {number} resolution The bits necessary to reach a given resolution, in meters.
 * @returns Bits necessary to reach a given resolution, in meters, for the latitude.
 */
export declare function latitudeBitsForResolution(resolution: number): number;
/**
 * Wraps the longitude to [-180,180].
 * @private
 * @param {number} longitude The longitude to wrap.
 * @returns longitude The resulting longitude.
 */
export declare function wrapLongitude(longitude: number): number;
/**
 * Calculates a set of geohash queries to fully contain a given circle. A query is a [start, end] pair
 * where any geohash is guaranteed to be lexiographically larger then start and smaller than end.
 *
 * @param {object} center The center given as {latitude, longitude}.
 * @param {number} radius The radius of the circle in meters.
 * @return An array of geohashes containing a [start, end] pair.
 */
export declare function getGeohashesForRadius(center: IGeoPoint, radius: number): string[][];
/**
 * Calculates a set of geohash queries to fully contain a given region box. A query is a [start, end] pair
 * where any geohash is guaranteed to be lexiographically larger then start and smaller than end.
 *
 * @param {object} region The region given as {latitude, longitude, latitudeDelta, longitudeDelta}.
 * @return An array of geohashes containing a [start, end] pair.
 */
export declare function getGeohashesForRegion(region: IGeoRegion): string[][];
/**
 * Flattens a query start-geohash; and end-geohash into all its individual geohash components.
 *
 * @param {string} geohash1 The geohash from range
 * @param {string} geohash2 The geohash to range
 */
export declare function flattenGeohashRange(geohash1: string, geohash2: string): string[];
/**
 * Flattens a set of geo-hash queries into a single array of geohash tiles.
 *
 * @param {string[][]} geohashes The geohashes array
 */
export declare function flattenGeohashes(geohashes: string[][]): string[];
/**
 * Method which calculates the distance, in meters, between two locations,
 * via the Haversine formula. Note that this is approximate due to the fact that the
 * Earth's radius varies between 6356.752 km and 6378.137 km.
 *
 * @param {object} location1 The {latitude, longitude} of the first location.
 * @param {object} location2 The {latitude, longitude} of the second location.
 * @returns The distance, in meters, between the inputted locations.
 */
export declare function calculateGeoDistance(location1: IGeoPoint, location2: IGeoPoint): number;
export declare function insideGeoRegion(point: IGeoPoint, region: IGeoRegion): boolean;
