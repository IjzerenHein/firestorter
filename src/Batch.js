// @flow
import { resolveRef } from './Utils';
import { getFirestore } from './init';
import type { DocumentReference } from 'firebase/firestore';

/**
 * Definition of the Operation object.
 *
 * @typedef {object} Operation
 * @property {DocumentReference | string | () => string} [source] Ref, path or observable function
 * @property {string} [operation] Type of operation
 * @property {object | void} [data] Data to be used in set and update
 */
class Operation {

	_source: DocumentReference;
	_operation: string;
	_data: Object | void;

	constructor (
		source: DocumentReference | string | (() => string),
		operation: 'set' | 'update' | 'delete',
		data: Object | void
	) {
		this._source = resolveRef(source);
		this._operation = operation;
		this._data = data;
	}
}

/**
 * The Batch class is a wrapper for the firebase.firestore().batch object.
 *
 * It accepts an array of Operation objects which contain the source
 * docRef (as path, ref or obs func), operation[set,update,delete]
 * and an optional data object to be used by put or delete.
 *
 * @param {Array<any>} [operations] Array of operations to be included in the batch
 */
class Batch {

	_operations: Operation[] = [];

	/**
	 *
	 * @param {Array<any>} [operations]
	 */
	constructor (
		operations: Array<any>
	) {
		this.operations = operations;
	}

	/**
	 *
	 * @param {Array<any>} [operations]
	 * @returns {void}
	 */
	set operations (operations: Array<any>) {
		operations.forEach((op) => {
			this._operations.push(new Operation(op.source, op.operation, op.data));
		});
	}

	/**
	 * Ryn
	 *
	 * @returns {Promise<void>}
	 */
	run (): Promise<any> {
		const batch = getFirestore().batch();
		this._operations.forEach((operation: Operation) => {
			//args for all operations
			const args = [operation._source];

			//if not doing delete push in the data as extra arg
			if (operation._operation !== 'delete') {
				args.push(operation._data);
			}
			//call batch operation with args
			batch[operation._operation](...args);
		});

		return batch.commit();
	}
}

export default Batch;
