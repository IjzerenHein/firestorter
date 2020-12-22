// Taken from https://github.com/firebase/geofire-js/blob/master/src/utils.ts
// And slightly modified to remove warnings and add the IGeoPoint type.

export interface IGeoPoint {
  readonly latitude: number;
  readonly longitude: number;
}

export interface IGeoRegion extends IGeoPoint {
  readonly latitudeDelta: number;
  readonly longitudeDelta: number;
}

export type GeoHash = string;

// Default geohash length
const GEOHASH_PRECISION = 10;

// Characters used in location geohashes
const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';

// The meridional circumference of the earth in meters
const EARTH_MERI_CIRCUMFERENCE = 40007860;

// Length of a degree latitude at the equator
const METERS_PER_DEGREE_LATITUDE = 110574;

// Number of bits per geohash character
const BITS_PER_CHAR = 5;

// Maximum length of a geohash in bits
const MAXIMUM_BITS_PRECISION = 22 * BITS_PER_CHAR;

// Equatorial radius of the earth in meters
const EARTH_EQ_RADIUS = 6378137.0;

// The following value assumes a polar radius of
// const EARTH_POL_RADIUS = 6356752.3;
// The formulate to calculate E2 is
// E2 == (EARTH_EQ_RADIUS^2-EARTH_POL_RADIUS^2)/(EARTH_EQ_RADIUS^2)
// The exact value is used here to avoid rounding errors
const E2 = 0.00669447819799;

// Cutoff for rounding errors on double calculations
const EPSILON = 1e-12;

/*
function fromGeoPoint(point: IGeoPoint): number[] {
	return [point.latitude, point.longitude];
} */

function toGeoPoint(location: number[]): IGeoPoint {
  return {
    latitude: location[0],
    longitude: location[1],
  };
}

function log2(x: number): number {
  return Math.log(x) / Math.log(2);
}

/**
 * Validates the inputted location and throws an error if it is invalid.
 * @private
 * @param {object} location The {latitude, longitude} to be verified.
 */
function validateLatitude(latitude: number): void {
  if (typeof latitude !== 'number' || isNaN(latitude)) {
    throw new Error('latitude must be a number');
  } else if (latitude < -90 || latitude > 90) {
    throw new Error('latitude must be within the range [-90, 90]');
  }
}

/**
 * @private
 */
function validateLongitude(longitude: number): void {
  if (typeof longitude !== 'number' || isNaN(longitude)) {
    throw new Error('longitude must be a number');
  } else if (longitude < -180 || longitude > 180) {
    throw new Error('longitude must be within the range [-180, 180]');
  }
}

/**
 * @private
 */
function validateLocation(location: IGeoPoint): void {
  try {
    if (!location) {
      throw new Error('location is empty');
    }
    validateLatitude(location.latitude);
    validateLongitude(location.longitude);
  } catch (err) {
    throw new Error(`Invalid location "${location}": ${err.message}`);
  }
}

/**
 * @private
 */
function validateRegion(region: IGeoRegion): void {
  try {
    if (!region) {
      throw new Error('region is empty');
    }
    validateLatitude(region.latitude);
    validateLatitude(region.latitudeDelta);
    validateLongitude(region.longitude);
    validateLongitude(region.longitudeDelta);
  } catch (err) {
    throw new Error(`Invalid region "${region}": ${err.message}`);
  }
}

/**
 * Validates the inputted geohash and throws an error if it is invalid.
 * @private
 * @param {string} geohash The geohash to be validated.
 */
function validateGeohash(geohash: string): void {
  let error;

  if (typeof geohash !== 'string') {
    error = 'geohash must be a string';
  } else if (geohash.length === 0) {
    error = 'geohash cannot be the empty string';
  } else {
    for (const letter of geohash) {
      if (BASE32.indexOf(letter) === -1) {
        error = "geohash cannot contain '" + letter + "'";
      }
    }
  }

  if (typeof error !== 'undefined') {
    throw new Error("Invalid geohash '" + geohash + "': " + error);
  }
}

/**
 * Converts a region into its geo points (nortEast, southWest, etc..).
 *
 * @param {IGeoRegion} region The region to convert
 */
export function geoRegionToPoints(
  region: IGeoRegion
): {
  northEast: IGeoPoint;
  northWest: IGeoPoint;
  southEast: IGeoPoint;
  southWest: IGeoPoint;
} {
  const north = region.latitude - region.latitudeDelta * 0.5;
  const south = region.latitude + region.latitudeDelta * 0.5;
  const east = wrapLongitude(region.longitude + region.longitudeDelta * 0.5);
  const west = wrapLongitude(region.longitude - region.longitudeDelta * 0.5);
  return {
    northEast: { latitude: north, longitude: east },
    northWest: { latitude: north, longitude: west },
    southEast: { latitude: south, longitude: east },
    southWest: { latitude: south, longitude: west },
  };
}

/**
 * Converts degrees to radians.
 * @private
 * @param {number} degrees The number of degrees to be converted to radians.
 * @returns The number of radians equal to the inputted number of degrees.
 */
function degreesToRadians(degrees: number): number {
  if (typeof degrees !== 'number' || isNaN(degrees)) {
    throw new Error('Error: degrees must be a number');
  }

  return (degrees * Math.PI) / 180;
}

/**
 * Encodes a geographical position (latitude/longitude) into a geohash tile.
 *
 * @param {object} location The {latitude, longitude} to encode into a geohash.
 * @param {number} [precision] The length of the geohash to create. If no precision is specified, the
 * default precision of `10` is used.
 * @returns The geohash of the inputted location.
 */
export function encodeGeohash(location: IGeoPoint, precision: number = GEOHASH_PRECISION): string {
  validateLocation(location);
  if (typeof precision !== 'undefined') {
    if (typeof precision !== 'number' || isNaN(precision)) {
      throw new Error('precision must be a number');
    } else if (precision <= 0) {
      throw new Error('precision must be greater than 0');
    } else if (precision > 22) {
      throw new Error('precision cannot be greater than 22');
    } else if (Math.round(precision) !== precision) {
      throw new Error('precision must be an integer');
    }
  }

  const latitudeRange = {
    max: 90,
    min: -90,
  };
  const longitudeRange = {
    max: 180,
    min: -180,
  };
  let hash = '';
  let hashVal = 0;
  let bits = 0;
  let even: number | boolean = 1;

  while (hash.length < precision) {
    const val = even ? location.longitude : location.latitude;
    const range = even ? longitudeRange : latitudeRange;
    const mid = (range.min + range.max) / 2;

    if (val > mid) {
      hashVal = (hashVal << 1) + 1;
      range.min = mid;
    } else {
      hashVal = (hashVal << 1) + 0;
      range.max = mid;
    }

    even = !even;
    if (bits < 4) {
      bits++;
    } else {
      bits = 0;
      hash += BASE32[hashVal];
      hashVal = 0;
    }
  }

  return hash;
}

/**
 * Decodes a geohash tile into a geographical position (latitude/longitude).
 *
 * @param {string} geohash - Geohash tile
 */
export function decodeGeohash(geohash: string): IGeoPoint[] {
  validateGeohash(geohash);

  let evenBit = true;
  let latMin = -90;
  let latMax = 90;
  let lonMin = -180;
  let lonMax = 180;

  for (let i = 0; i < geohash.length; i++) {
    const chr = geohash.charAt(i);
    const idx = BASE32.indexOf(chr);
    if (idx < 0) {
      throw new Error('Invalid geohash');
    }

    for (let n = 4; n >= 0; n--) {
      const bitN = (idx >> n) & 1;
      if (evenBit) {
        // longitude
        const lonMid = (lonMin + lonMax) / 2;
        if (bitN === 1) {
          lonMin = lonMid;
        } else {
          lonMax = lonMid;
        }
      } else {
        // latitude
        const latMid = (latMin + latMax) / 2;
        if (bitN === 1) {
          latMin = latMid;
        } else {
          latMax = latMid;
        }
      }
      evenBit = !evenBit;
    }
  }

  return [
    { latitude: latMin, longitude: lonMin }, // sw
    { latitude: latMax, longitude: lonMax }, // ne
  ];
}

/**
 * Calculates the number of longitude degrees over a given distance and at a given latitude.
 *
 * @param {number} distance The distance to convert.
 * @param {number} latitude The latitude at which to calculate.
 * @returns The number of degrees the distance corresponds to.
 */
export function metersToLongitudeDegrees(distance: number, latitude: number): number {
  const radians = degreesToRadians(latitude);
  const num = (Math.cos(radians) * EARTH_EQ_RADIUS * Math.PI) / 180;
  const denom = 1 / Math.sqrt(1 - E2 * Math.sin(radians) * Math.sin(radians));
  const deltaDeg = num * denom;
  if (deltaDeg < EPSILON) {
    return distance > 0 ? 360 : 0;
  } else {
    return Math.min(360, distance / deltaDeg);
  }
}

/**
 * Calculates the number of latitude degrees over a given distance.
 *
 * @param {number} distance The distance to convert.
 * @returns The number of degrees the distance corresponds to.
 */
export function metersToLatitudeDegrees(distance: number): number {
  return distance / METERS_PER_DEGREE_LATITUDE;
}

/**
 * Calculates the bits necessary to reach a given resolution, in meters, for the longitude at a
 * given latitude.
 * @ignore
 * @param {number} resolution The desired resolution.
 * @param {number} latitude The latitude used in the conversion.
 * @return The bits necessary to reach a given resolution, in meters.
 */
export function longitudeBitsForResolution(resolution: number, latitude: number): number {
  const degs = metersToLongitudeDegrees(resolution, latitude);
  return Math.abs(degs) > 0.000001 ? Math.max(1, log2(360 / degs)) : 1;
}

/**
 * Calculates the bits necessary to reach a given resolution, in meters, for the latitude.
 * @ignore
 * @param {number} resolution The bits necessary to reach a given resolution, in meters.
 * @returns Bits necessary to reach a given resolution, in meters, for the latitude.
 */
export function latitudeBitsForResolution(resolution: number): number {
  return Math.min(log2(EARTH_MERI_CIRCUMFERENCE / 2 / resolution), MAXIMUM_BITS_PRECISION);
}

/**
 * Wraps the longitude to [-180,180].
 * @private
 * @param {number} longitude The longitude to wrap.
 * @returns longitude The resulting longitude.
 */
export function wrapLongitude(longitude: number): number {
  if (longitude <= 180 && longitude >= -180) {
    return longitude;
  }
  const adjusted = longitude + 180;
  if (adjusted > 0) {
    return (adjusted % 360) - 180;
  } else {
    return 180 - (-adjusted % 360);
  }
}

/**
 * Calculates the maximum number of bits of a geohash to get a bounding box that is larger than a
 * given size at the given coordinate.
 * @ignore
 * @param {object} coordinate The coordinate as a {latitude, longitude}.
 * @param {number} size The size of the bounding box.
 * @returns The number of bits necessary for the geohash.
 */
function boundingBoxBits(coordinate: IGeoPoint, size: number): number {
  const latDeltaDegrees = size / METERS_PER_DEGREE_LATITUDE;
  const latitudeNorth = Math.min(90, coordinate.latitude + latDeltaDegrees);
  const latitudeSouth = Math.max(-90, coordinate.latitude - latDeltaDegrees);
  const bitsLat = Math.floor(latitudeBitsForResolution(size)) * 2;
  const bitsLongNorth = Math.floor(longitudeBitsForResolution(size, latitudeNorth)) * 2 - 1;
  const bitsLongSouth = Math.floor(longitudeBitsForResolution(size, latitudeSouth)) * 2 - 1;
  return Math.min(bitsLat, bitsLongNorth, bitsLongSouth, MAXIMUM_BITS_PRECISION);
}
function boundingBoxBitsForRegion(region: IGeoRegion): number {
  const { northEast, southEast, northWest, southWest } = geoRegionToPoints(region);
  const bitsLat =
    Math.floor(latitudeBitsForResolution(calculateGeoDistance(northEast, southEast) * 0.5)) * 2;
  const bitsLongNorth =
    Math.floor(
      longitudeBitsForResolution(
        calculateGeoDistance(northEast, northWest) * 0.5,
        northWest.latitude
      )
    ) *
      2 -
    1;
  const bitsLongSouth =
    Math.floor(
      longitudeBitsForResolution(
        calculateGeoDistance(southEast, southWest) * 0.5,
        southWest.latitude
      )
    ) *
      2 -
    1;
  return Math.min(bitsLat, bitsLongNorth, bitsLongSouth, MAXIMUM_BITS_PRECISION);
}

/**
 * Calculates eight points on the bounding box and the center of a given circle. At least one
 * geohash of these nine coordinates, truncated to a precision of at most radius, are guaranteed
 * to be prefixes of any geohash that lies within the circle.
 * @ignore
 * @param {object} center The center given as {latitude, longitude}.
 * @param {number} radius The radius of the circle in meters.
 * @returns The eight bounding box points.
 */
function boundingBoxCoordinates(center: IGeoPoint, radius: number): number[][] {
  const latDegrees = radius / METERS_PER_DEGREE_LATITUDE;
  const latitudeNorth = Math.min(90, center.latitude + latDegrees);
  const latitudeSouth = Math.max(-90, center.latitude - latDegrees);
  const longDegsNorth = metersToLongitudeDegrees(radius, latitudeNorth);
  const longDegsSouth = metersToLongitudeDegrees(radius, latitudeSouth);
  const longDegs = Math.max(longDegsNorth, longDegsSouth);
  return [
    [center.latitude, center.longitude],
    [center.latitude, wrapLongitude(center.longitude - longDegs)],
    [center.latitude, wrapLongitude(center.longitude + longDegs)],
    [latitudeNorth, center.longitude],
    [latitudeNorth, wrapLongitude(center.longitude - longDegs)],
    [latitudeNorth, wrapLongitude(center.longitude + longDegs)],
    [latitudeSouth, center.longitude],
    [latitudeSouth, wrapLongitude(center.longitude - longDegs)],
    [latitudeSouth, wrapLongitude(center.longitude + longDegs)],
  ];
}

/**
 * Calculates eight points on the bounding box and the center of a region box. At least one
 * geohash of these nine coordinates, truncated to a precision of at most radius, are guaranteed
 * to be prefixes of any geohash that lies within the circle.
 * @ignore
 * @param {object} region The region given as {latitude, longitude, latitudeDelta, longitudeDelta}.
 * @returns The eight bounding box points.
 */
function boundingBoxCoordinatesForRegion(region: IGeoRegion): number[][] {
  const { northEast, northWest, southWest } = geoRegionToPoints(region);
  return [
    [region.latitude, region.longitude],
    [region.latitude, northEast.longitude],
    [region.latitude, northWest.longitude],
    [northWest.latitude, region.longitude],
    [northWest.latitude, northEast.longitude],
    [northWest.latitude, northWest.longitude],
    [southWest.latitude, region.longitude],
    [southWest.latitude, northEast.longitude],
    [southWest.latitude, northWest.longitude],
  ];
}

/**
 * Calculates the bounding box query for a geohash with x bits precision.
 * @ignore
 * @param {string} geohash The geohash whose bounding box query to generate.
 * @param {number} bits The number of bits of precision.
 * @returns A [start, end] pair of geohashes.
 */
function geohashQuery(geohash1: string, bits: number): string[] {
  validateGeohash(geohash1);
  const precision = Math.ceil(bits / BITS_PER_CHAR);
  if (geohash1.length < precision) {
    return [geohash1, geohash1 + '~'];
  }
  const geohash = geohash1.substring(0, precision);
  const base = geohash.substring(0, geohash.length - 1);
  const lastValue = BASE32.indexOf(geohash.charAt(geohash.length - 1));
  const significantBits = bits - base.length * BITS_PER_CHAR;
  const unusedBits = BITS_PER_CHAR - significantBits;
  // delete unused bits
  const startValue = (lastValue >> unusedBits) << unusedBits;
  const endValue = startValue + (1 << unusedBits);
  if (endValue > 31) {
    return [base + BASE32[startValue], base + '~'];
  } else {
    return [base + BASE32[startValue], base + BASE32[endValue]];
  }
}

/**
 * Calculates a set of geohash queries to fully contain a given circle. A query is a [start, end] pair
 * where any geohash is guaranteed to be lexiographically larger then start and smaller than end.
 *
 * @param {object} center The center given as {latitude, longitude}.
 * @param {number} radius The radius of the circle in meters.
 * @return An array of geohashes containing a [start, end] pair.
 */
export function getGeohashesForRadius(center: IGeoPoint, radius: number): string[][] {
  validateLocation(center);
  const bits = Math.max(1, boundingBoxBits(center, radius));
  const precision = Math.ceil(bits / BITS_PER_CHAR);
  const coordinates = boundingBoxCoordinates(center, radius);
  const queries = coordinates.map((coordinate) => {
    return geohashQuery(encodeGeohash(toGeoPoint(coordinate), precision), bits);
  });
  // remove duplicates
  return queries.filter((query, index) => {
    return !queries.some((other, otherIndex) => {
      return index > otherIndex && query[0] === other[0] && query[1] === other[1];
    });
  });
}

/**
 * Calculates a set of geohash queries to fully contain a given region box. A query is a [start, end] pair
 * where any geohash is guaranteed to be lexiographically larger then start and smaller than end.
 *
 * @param {object} region The region given as {latitude, longitude, latitudeDelta, longitudeDelta}.
 * @return An array of geohashes containing a [start, end] pair.
 */
export function getGeohashesForRegion(region: IGeoRegion): string[][] {
  validateRegion(region);
  const bits = Math.max(1, boundingBoxBitsForRegion(region));
  const precision = Math.ceil(bits / BITS_PER_CHAR);
  const coordinates = boundingBoxCoordinatesForRegion(region);
  const queries = coordinates.map((coordinate) => {
    const geohash = encodeGeohash(toGeoPoint(coordinate), precision);
    const query = geohashQuery(geohash, bits);
    /* console.log(
			geohash,
			", index: ",
			index,
			", query: ",
			query,
			", precision: ",
			precision
		); */
    return query;
  });
  // remove duplicates
  return queries.filter((query, index) => {
    return !queries.some((other, otherIndex) => {
      return index > otherIndex && query[0] === other[0] && query[1] === other[1];
    });
  });
}

/**
 * Flattens a query start-geohash; and end-geohash into all its individual geohash components.
 *
 * @param {string} geohash1 The geohash from range
 * @param {string} geohash2 The geohash to range
 */
export function flattenGeohashRange(geohash1: string, geohash2: string): string[] {
  if (geohash1.length !== geohash2.length) {
    throw new Error('Geohash lengths must be the same');
  }
  const res: string[] = [geohash1];
  let hash = geohash1;
  while (hash < geohash2) {
    for (let i = geohash1.length - 1; i >= 0; i--) {
      const idx = BASE32.indexOf(hash.charAt(i));
      if (idx < BASE32.length - 1) {
        hash = hash.substring(0, i) + BASE32[idx + 1] + hash.substring(i + 1);
        if (hash < geohash2) {
          res.push(hash);
        }
        break;
      } else {
        hash = hash.substring(0, i) + BASE32[0] + hash.substring(i + 1);
      }
      if (hash >= geohash2) {
        break;
      }
    }
  }
  return res;
}

/**
 * Flattens a set of geo-hash queries into a single array of geohash tiles.
 *
 * @param {string[][]} geohashes The geohashes array
 */
export function flattenGeohashes(geohashes: string[][]): string[] {
  const set = new Set<string>();
  geohashes.forEach((a) => flattenGeohashRange(a[0], a[1]).forEach((geohash) => set.add(geohash)));
  return Array.from(set);
}

/**
 * Method which calculates the distance, in meters, between two locations,
 * via the Haversine formula. Note that this is approximate due to the fact that the
 * Earth's radius varies between 6356.752 km and 6378.137 km.
 *
 * @param {object} location1 The {latitude, longitude} of the first location.
 * @param {object} location2 The {latitude, longitude} of the second location.
 * @returns The distance, in meters, between the inputted locations.
 */
export function calculateGeoDistance(location1: IGeoPoint, location2: IGeoPoint): number {
  validateLocation(location1);
  validateLocation(location2);

  const radius = 6371; // Earth's radius in kilometers
  const latDelta = degreesToRadians(location2.latitude - location1.latitude);
  const lonDelta = degreesToRadians(location2.longitude - location1.longitude);

  const a =
    Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
    Math.cos(degreesToRadians(location1.latitude)) *
      Math.cos(degreesToRadians(location2.latitude)) *
      Math.sin(lonDelta / 2) *
      Math.sin(lonDelta / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return radius * c * 1000;
}

export function insideGeoRegion(point: IGeoPoint, region: IGeoRegion): boolean {
  if (
    point.latitude < region.latitude - region.latitudeDelta * 0.5 ||
    point.latitude > region.latitude + region.latitudeDelta * 0.5
  ) {
    return false;
  }
  // TODO - wrap longitude?
  if (
    point.longitude < region.longitude - region.longitudeDelta * 0.5 ||
    point.longitude > region.longitude + region.longitudeDelta * 0.5
  ) {
    return false;
  }
  return true;
}
