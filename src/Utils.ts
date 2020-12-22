import { Mode } from './Types';
import { getFirebase, IHasContext } from './init';

const isEqual = require('lodash.isequal');

/**
 * Helper function which merges data into the source
 * and returns the new object.
 *
 * @param {Object} data - JSON data
 * @param {Object} fields - JSON data that supports field-paths
 * @return {Object} Result
 */
export function mergeUpdateData(data: object, fields: object, hasContext?: IHasContext) {
  const res = {
    ...data,
  };
  const canonicalDelete = getFirebase(hasContext).firestore.FieldValue.delete();
  for (const key in fields) {
    if (fields.hasOwnProperty(key)) {
      const val = fields[key];
      const isDelete = canonicalDelete.isEqual
        ? canonicalDelete.isEqual(val)
        : isEqual(canonicalDelete, val);
      const paths = key.split('.');
      let dataVal = res;
      for (let i = 0; i < paths.length - 1; i++) {
        if (dataVal[paths[i]] === undefined) {
          if (isDelete) {
            dataVal = undefined;
            break;
          }
          dataVal[paths[i]] = {};
        } else {
          dataVal[paths[i]] = {
            ...dataVal[paths[i]],
          };
        }
        dataVal = dataVal[paths[i]];
      }
      if (isDelete) {
        if (dataVal) {
          delete dataVal[paths[paths.length - 1]];
        }
      } else {
        dataVal[paths[paths.length - 1]] = val;
      }
    }
  }
  return res;
}

export function verifyMode(mode: Mode): Mode {
  switch (mode) {
    case 'auto':
    case 'off':
    case 'on':
      return mode;
    default:
      throw new Error('Invalid mode mode: ' + mode);
  }
}

/**
 * Checks whether the provided value is a valid Firestore Timestamp or Date.
 *
 * Use this function in combination with schemas, in order to validate
 * that the field in the document is indeed a timestamp.
 *
 * @param {Object} val - Value to check
 * @return {Boolean}
 *
 * @example
 * import { isTimestamp } from 'firestorter';
 *
 * const TaskSchema = struct({
 *  name: 'string',
 *  startDate: isTimestamp,
 *  duration: 'number'
 * });
 *
 * const doc = new Document('tasks/mytask', {
 *   schema: TaskSchema
 * });
 * await doc.fetch();
 * console.log('startDate: ', doc.data.startDate.toDate());
 */
export function isTimestamp(val: any): boolean {
  if (val instanceof Date) {
    return true;
  }
  return (
    typeof val === 'object' &&
    typeof val.seconds === 'number' &&
    typeof val.nanoseconds === 'number'
  );
}
