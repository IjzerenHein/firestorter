import isEqual from 'lodash.isequal';
import { Mode, IHasContext } from './Types';
export { isEqual };
/**
 * Helper function which merges data into the source
 * and returns the new object.
 *
 * @param {Object} data - JSON data
 * @param {Object} fields - JSON data that supports field-paths
 * @return {Object} Result
 */
export declare function mergeUpdateData(data: object, fields: object, hasContext?: IHasContext): {};
export declare function verifyMode(mode: Mode): Mode;
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
export declare function isTimestamp(val: any): boolean;
