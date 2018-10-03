import { getFirebase } from "./init";

/**
 * Helper function which merges data into the source
 * and returns the new object.
 *
 * @param {Object} data - JSON data
 * @param {Object} fields - JSON data that supports field-paths
 * @return {Object} Result
 */
function mergeUpdateData(data: object, fields: object) {
	const res = {
		...data
	};
	for (const key in fields) {
		const val = fields[key];
		const isDelete = val === (<any>getFirebase()).firestore.FieldValue.delete();
		const paths = key.split(".");
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
					...dataVal[paths[i]]
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
	return res;
}

enum Mode {
	Auto = "auto",
	On = "on",
	Off = "off"
}

function verifyMode(mode: Mode): Mode {
	switch (mode) {
		case "auto":
		case "off":
		case "on":
			return mode;
		default:
			throw new Error("Invalid mode mode: " + mode);
	}
}

export { mergeUpdateData, Mode, verifyMode };
