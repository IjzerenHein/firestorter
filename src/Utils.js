import { getFirebase, getFirestore } from './init';

/**
 * Helper function which merges data into the source
 * and returns the new object.
 *
 * @param {Object} data - JSON data
 * @param {Object} fields - JSON data that supports field-paths
 * @return {Object} Result
 */
function mergeUpdateData(data, fields) {
	const res = {
		...data
	};
	for (const key in fields) {
		const val = fields[key];
		const isDelete = val === getFirebase().firestore.FieldValue.delete();
		const paths = key.split('.');
		let dataVal = res;
		for (let i = 0; i < (paths.length - 1); i++) {
			if (dataVal[paths[i]] === undefined) {
				if (isDelete) {
					dataVal = undefined;
					break;
				}
				dataVal[paths[i]] = {};
			}
			else {
				dataVal[paths[i]] = {
					...dataVal[paths[i]]
				};
			}
			dataVal = dataVal[paths[i]];
		}
		if (isDelete) {
			if (dataVal) {
				delete dataVal[paths[paths.length - 1]];
			}
		}
		else {
			dataVal[paths[paths.length - 1]] = val;
		}
	}
	return res;
}

/**
 * Taken out of the Document class to be used
 * by the Batch class.
 *
 * @param {any} value
 */
function resolveRef(value) {
  if (typeof value === 'string') {
    return getFirestore().doc(value);
  } else if (typeof value === 'function') {
    return resolveRef(value());
  }
  /*
  Not sure about this. I don't think it should be responsibility of the user to
  extract the reference from Firestorter Document when passing into a Batch
  so this is the logical place to do this but the test is pretty heinous.
   */
  else if (typeof value === 'object' && value.constructor.name === 'Document'){
    return value.ref;
  } else {
    return value;
  }
}

export {
	mergeUpdateData,
	resolveRef
};
