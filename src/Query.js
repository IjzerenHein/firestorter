// @flow

/**
 * @private
 */
function _r(value) {
	return (typeof value === 'function') ? value() : value;
}

/**
 * @private
 */
function _resolveRule(ref, rule) {
	switch (rule[0]) {
		case 'where': return ref.where(_r(rule[1]), _r(rule[2]), _r(rule[3]));
		case 'orderBy': return ref.orderBy(_r(rule[1]), (rule.length >= 3) ? _r(rule[2]) : undefined);
		case 'limit': return ref.limit(_r(rule[1]));
		case 'startAt': return ref.startAt(rule[1]);
		case 'startAfter': return ref.startAfter(rule[1]);
		case 'endAt': return ref.endAt(rule[1]);
		case 'endAfter': return ref.endAfter(rule[1]);
	}
}

/**
 * The Query class - TODO
 *
 * @example
 * import {Collection, Query} from 'firestorter';
 *
 * // Create a collection with a query
 * const albums = new Collection('artists/Metallica/albums', {
 * 	 query: Query.where('name', '>=' 'Black').orderBy('name', 'desc').limit(2)
 * });
 *
 * // Assign new query to collection
 * albums.query = Query.where('year', '<=', 1990).orderBy('year', 'asc');
 *
 * // Make the query dependent on an observable value
 * const minYear = new observable.box(1990);
 * const maxYear = new observable.box(2010);
 * albums.query = Query.where('year', '>=', () => minYear).where('year', '<=', () => maxYear);
 * minYear.set(2000); // Changing the observable, automatically updates the Collection
 */
class Query {

	_rules: any;

	constructor(rules = []) {
		this._rules = rules;
	}

	/**
	 * Creates a new query that returns only documents that include
	 * the specified fields and where the values satisfy the constraints provided.
	 *
	 * @param {String|Function} fieldPath - The path to compare
	 * @param {String|Function} operation - Compare operation (e.g "<", "<=", "==", ">", ">=")
	 * @param {Any|Function} value - The value for comparison
	 * @return {Query} The created query
	 */
	where(fieldPath, operation, value) {
		return this._addRule('where', fieldPath, operation, value);
	}

	/**
	 * Creates a new query where the results are sorted by the specified
	 * field, in descending or ascending order.
	 *
	 * @param {String|Function} fieldPath - The field to sort by
	 * @param {String|Function} [direction] - Order by direction ("asc" or "desc")
	 * @return {Query} The created query
	 */
	orderBy(fieldPath, direction) {
		return this._addRule('orderBy', fieldPath, direction);
	}

	/**
	 * Creates a new query where the results are limited to the specified
	 * number of documents.
	 *
	 * @param {Number|Function} value - The maximum number of items to return
	 * @return {Query} The created query
	 */
	limit(value) {
		return this._addRule('limit', value);
	}

	/**
	 * Creates a new query where the results end at the provided document
	 * (inclusive). The end position is relative to the order of the query.
	 * The document must contain all of the fields provided in the orderBy
	 * of this query.
	 *
	 * @param {Any|Function} value
	 * @return {Query} The created query
	 */
	endAt(value) {
		return this._addRule('endAt', value);
	}

	/**
	 * Creates a new query where the results end before the provided document
	 * (exclusive). The end position is relative to the order of the query.
	 * The document must contain all of the fields provided in the orderBy
	 * of this query.
	 *
	 * @param {Any|Function} value
	 * @return {Query} The created query
	 */
	endBefore(value) {
		return this._addRule('endBefore', value);
	}

	/**
	 * Creates a new query where the results start after the provided document
	 * (exclusive). The starting position is relative to the order of the query.
	 * The document must contain all of the fields provided in the orderBy of
	 * this query.
	 *
	 * @param {Any|Function} value
	 * @return {Query} The created query
	 */
	startAfter(value) {
		return this._addRule('startAfter', value);
	}

	/**
	 * Creates a new query where the results start at the provided document
	 * (inclusive). The starting position is relative to the order of the query.
	 * The document must contain all of the fields provided in the orderBy of
	 * the query.
	 *
	 * @param {Any|Function} value
	 * @return {Query} The created query
	 */
	startAt(value) {
		return this._addRule('startAt', value);
	}

	/**
	 * @private
	 * Returns the firestore Query-reference for the given
	 * firestore Collection-reference.
	 *
	 * This function applies all query rules and resolves any
	 * observed properties before applying them.
	 *
	 * @param {CollectionReference} collectionRef - Firestore collection-reference
	 * @return {FirestoreQuery} Firestore query
	 */
	resolveRef(collectionRef) {
		return this._rules.reduce(_resolveRule, collectionRef);
	}

	/**
	 * @private
	 */
	_addRule(type, arg1, arg2, arg3) {
		const rule = [type];
		if (arg1 !== undefined) rule.push(arg1);
		if (arg2 !== undefined) rule.push(arg2);
		if (arg3 !== undefined) rule.push(arg3);
		const rules = this._rules.slice(0);
		rules.push(rules);
		return new Query(rules);
	}
}

const query = new Query();

export default query;
