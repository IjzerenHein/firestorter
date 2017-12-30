// @flow
import { observable, transaction, reaction } from 'mobx';
import { enhancedObservable } from './enhancedObservable';
import { getFirestore } from './init';
import isEqual from 'lodash.isequal';

import type { DocumentSnapshot, DocumentReference } from 'firebase/firestore';

/**
 * @private
 */
function resolveRef(value) {
	if (typeof value === 'string') {
		return getFirestore().doc(value);
	} else if (typeof value === 'function') {
		return resolveRef(value());
	} else {
		return value;
	}
}

/**
 * Document represents a document stored in the firestore no-sql database.
 * Document is observable so that it can be efficiently linked to a React
 * Component using `mobx-react`'s `observer` pattern. This ensures that a
 * component is only re-rendered when data that is accessed in the `render`
 * function has changed.
 *
 * @param {DocumentReference | string | () => string | void} [source] Ref, path or observable function
 * @param {Object} [options] Configuration options
 * @param {String} [options.realtimeUpdating] See `Document.realtimeUpdating` (default: auto)
 * @param {Object} [options.schema] Superstruct schema for data validation
 * @param {DocumentSnapshot} [options.snapshot] Initial document snapshot
 * @param {Bool} [options.debug] Enables debug logging
 * @param {String} [options.debugName] Name to use when debug logging is enabled
 */
class Document {
	static EMPTY_OPTIONS = {};

	_source: any;
	_sourceDisposer: any;
	_ref: any;
	_snapshot: any;
	_schema: any;
	_debug: any;
	_collectionRefCount: number;
	_observedRefCount: number;
	_createTime: any;
	_updateTime: any;
	_readTime: any;
	_data: any;
	_realtimeUpdating: any;
	_fetching: any;
	_onSnapshotUnsubscribe: any;

	constructor(
		source: DocumentReference | string | (() => string | void),
		options: any
	) {
		const { schema, snapshot, realtimeUpdating = 'auto', debug, debugName } =
			options || Document.EMPTY_OPTIONS;
		this._source = source;
		this._ref = observable(resolveRef(source));
		this._schema = schema;
		this._debug = debug || false;
		this._debugName = debugName;
		this._snapshot = observable(snapshot);
		this._collectionRefCount = 0;
		this._observedRefCount = 0;
		this._createTime = enhancedObservable(
			snapshot ? snapshot.createTime : '',
			this
		);
		this._updateTime = enhancedObservable(
			snapshot ? snapshot.updateTime : '',
			this
		);
		this._readTime = enhancedObservable(
			snapshot ? snapshot.readTime : '',
			this
		);
		let data = snapshot ? snapshot.data() : undefined;
		if (data) data = this._validateSchema(data);
		this._data = enhancedObservable(data || Document.EMPTY_OPTIONS, this);
		this._realtimeUpdating = observable(realtimeUpdating);
		this._fetching = observable(false);
		if (realtimeUpdating === 'on') this._updateRealtimeUpdates();
	}

	/**
	 * Returns the superstruct schema used to validate the
	 * document, or undefined.
	 */
	get schema(): any {
		return this._schema;
	}

	/**
	 * @private
	 */
	_validateSchema(data: any): any {
		if (!this._schema) return data;
		try {
			data = this._schema(data);
		} catch (err) {
			// console.log(JSON.stringify(err));

			throw new Error(
				'Invalid value at "' +
					err.path +
					'" for ' +
					this.constructor.name +
					' with id "' +
					this.id +
					'": ' +
					err.message
			);
		}
		return data;
	}

	/**
	 * Returns the data inside the firestore document.
	 *
	 * @example
	 * const docData = todos.docs.map((doc) => {
	 *	console.log(doc.data);
	 *  // {
	 *  //   finished: false
	 *  //   text: 'Must do this'
	 *  // }
	 * });
	 */
	get data(): any {
		return this._data.get();
	}

	/**
	 * Firestore document reference.
	 *
	 * Use this property to get or set the document
	 * reference. When set, a fetch to the new document
	 * is performed.
	 *
	 * Alternatively, you can also use `path` to change the
	 * reference in more a readable way.
	 *
	 * @example
	 * const doc = new Document(firebase.firestore().doc('albums/splinter'));
	 * ...
	 * // Switch to another document
	 * doc.ref = firebase.firestore().doc('albums/americana');
	 */
	get ref(): ?DocumentReference {
		return this._ref.get();
	}
	set ref(ref: ?DocumentReference) {
		this.source = ref;
	}

	/**
	 * Id of the firestore document.
	 *
	 * To get the full-path of the document, use `path`.
	 */
	get id(): ?string {
		const ref = this._ref.get();
		return ref ? ref.id : undefined;
	}

	/**
	 * Path of the document (e.g. 'albums/blackAlbum').
	 *
	 * Use this property to switch to another document in
	 * the back-end. Effectively, it is a more compact
	 * and readable way of setting a new ref.
	 *
	 * @example
	 * const doc = new Document('artists/Metallica');
	 * ...
	 * // Switch to another document in the back-end
	 * doc.path = 'artists/EaglesOfDeathMetal';
	 *
	 * // Or, you can use a reactive function to link
	 * // to the contents of another document.
	 * const doc2 = new Document('settings/activeArtist');
	 * doc.path = () => 'artists/' + doc2.data.artistId;
	 */
	get path(): ?string {
		let ref = this._ref.get();
		if (!ref) return undefined;
		let path = ref.id;
		while (ref.parent) {
			path = ref.parent.id + '/' + path;
			ref = ref.parent;
		}
		return path;
	}
	set path(documentPath: string | (() => string | void)) {
		this.source = documentPath;
	}

	/**
	 * @private
	 */
	get source(): ?any {
		return this._source.get();
	}

	/**
	 * @private
	 */
	set source(source: ?any) {
		if (this._collectionRefCount)
			throw new Error(
				'Cannot change source on Document that is controlled by a Collection'
			);
		if (this._source === source) return;
		if (this._sourceDisposer) {
			this._sourceDisposer();
			this._sourceDisposer = undefined;
		}
		transaction(() => {
			this._source = source;
			this._ref.set(resolveRef(source));
			this._updateRealtimeUpdates(true);
		});
	}

	/**
	 * Real-time updating mode.
	 *
	 * Can be set to any of the following values:
	 * - "auto" (enables real-time updating when the document becomes observed)
	 * - "off" (no real-time updating, you need to call fetch explicitly)
	 * - "on" (real-time updating is permanently enabled)
	 */
	get realtimeUpdating(): string {
		return this._realtimeUpdating.get();
	}
	set realtimeUpdating(mode: string) {
		if (this._realtimeUpdating.get() === mode) return;
		switch (mode) {
			case 'auto':
			case 'off':
			case 'on':
				break;
			default:
				throw new Error('Invalid realtimeUpdating mode: ' + mode);
		}
		transaction(() => {
			this._realtimeUpdating.set(mode);
			this._updateRealtimeUpdates();
		});
	}

	/**
	 * Underlying firestore snapshot.
	 */
	get snapshot(): DocumentSnapshot {
		return this._snapshot.get();
	}

	/**
	 * Time the document was created in firestore.
	 */
	get createTime(): string {
		return this._readTime.get();
	}

	/**
	 * Time the document was last updated in firestore.
	 */
	get updateTime(): string {
		return this._updateTime.get();
	}

	/**
	 * Time this document was last read from firestore.
	 */
	get readTime(): string {
		return this._readTime.get();
	}

	/**
	 * Updates one or more fields in the document.
	 *
	 * The update will fail if applied to a document that does
	 * not exist.
	 *
	 * @example
	 * await todoDoc.update({
	 *	 finished: true,
	 *   text: 'O yeah, checked this one off',
	 *   foo: {
	 *     bar: 10
	 *   }
	 * });
	 */
	update(fields: any): Promise<void> {
		if (this._schema) {
			// Todo - investigate this deeper
			this._validateSchema({
				...this.data,
				fields
			});
		}
		return this._ref.get().update(fields);
	}

	/**
	 * Deletes the document in Firestore.
	 *
	 * Returns a promise that resolves once the document has been
	 * successfully deleted from the backend (Note that it won't
	 * resolve while you're offline).
	 */
	delete(): Promise<void> {
		return this._ref.get().delete();
	}

	/**
	 * Called whenever a property of this class becomes observed.
	 * @private
	 */
	addObserverRef(): number {
		if (this._debug)
			console.debug(
				`${this.debugName} - addRef (${this._observedRefCount + 1})`
			);
		const res = ++this._observedRefCount;
		this._updateRealtimeUpdates();
		return res;
	}

	/**
	 * Called whenever a property of this class becomes un-observed.
	 * @private
	 */
	releaseObserverRef(): number {
		if (this._debug)
			console.debug(
				`${this.debugName} - releaseRef (${this._observedRefCount - 1})`
			);
		const res = --this._observedRefCount;
		this._updateRealtimeUpdates();
		return res;
	}

	/**
	 * @private
	 */
	_updateFromSnapshot(snapshot: DocumentSnapshot) {
		const data = this._validateSchema(snapshot.data());
		this._snapshot.set(snapshot);
		this._createTime.set(snapshot.createTime);
		this._updateTime.set(snapshot.updateTime);
		this._readTime.set(snapshot.readTime);

		if (!isEqual(data, this._data.get())) {
			this._data.set(data);
		}

		/* for (const key in data) {
			this._data[key] = data[key];
		}*/
	}

	/**
	 * Fetches new data from firestore. Use this to manually fetch
	 * new data when `realtimeUpdating` is set to 'off'.
	 *
	 * @example
	 * const col = new Document('albums/splinter', 'off');
	 * col.fetch().then(({docs}) => {
	 *   docs.forEach(doc => console.log(doc));
	 * });
	 */
	fetch(): Promise<Document> {
		return new Promise((resolve, reject) => {
			if (this._collectionRefCount)
				return reject(
					new Error(
						'Should not call fetch on Document that is controlled by a Collection'
					)
				);
			if (this._active)
				return reject(
					new Error('Should not call fetch when real-time updating is active')
				);
			this._fetching.set(true);
			this._ref
				.get()
				.get()
				.then(
					snapshot => {
						transaction(() => {
							this._fetching.set(false);
							try {
								this._updateFromSnapshot(snapshot);
							} catch (err) {
								console.error(err.message);
							}
						});
						resolve(this);
					},
					err => {
						this._fetching.set(false);
						reject(err);
					}
				);
		});
	}

	/**
	 * True when a fetch is in progress.
	 *
	 * Fetches are performed in these cases:
	 *
	 * - When real-time updating is started
	 * - When a different `ref` or `path` is set
	 * - When a `query` is set or cleared
	 * - When `fetch` is explicitely called
	 */
	get fetching(): boolean {
		return this._fetching.get();
	}

	/**
	 * @private
	 */
	_onSnapshot(snapshot: DocumentSnapshot) {
		transaction(() => {
			this._fetching.set(false);
			try {
				this._updateFromSnapshot(snapshot);
			} catch (err) {
				console.error(err.message);
			}
		});
	}

	/**
	 * @private
	 */
	_updateRealtimeUpdates(force?: boolean) {
		let newActive = false;
		switch (this._realtimeUpdating.get()) {
			case 'auto':
				newActive = !!this._observedRefCount;
				break;
			case 'off':
				newActive = false;
				break;
			case 'on':
				newActive = true;
				break;
		}

		// Start/stop observing the source if neccessary
		if (typeof this._source === 'function') {
			if (newActive && !this._sourceDisposer) {
				this._sourceDisposer = reaction(
					() => this._source(),
					value => {
						transaction(() => {
							this._ref.set(resolveRef(value));
							this._updateRealtimeUpdates(true);
						});
					}
				);
			} else if (!newActive && this._sourceDisposer) {
				this._sourceDisposer();
				this._sourceDisposer = undefined;
			}
		}

		// Start/stop listening for snapshot updates
		if (this._collectionRefCount || !this._ref.get()) {
			newActive = false;
		}
		const active = !!this._onSnapshotUnsubscribe;
		if (newActive && (!active || force)) {
			if (this._debug)
				console.debug(
					`${this.debugName} - ${
						active ? 're-' : ''
					}start (${this._realtimeUpdating.get()}:${this._observedRefCount})`
				);
			this._fetching.set(true);
			if (this._onSnapshotUnsubscribe) this._onSnapshotUnsubscribe();
			this._onSnapshotUnsubscribe = this._ref
				.get()
				.onSnapshot(snapshot => this._onSnapshot(snapshot));
		} else if (!newActive && active) {
			if (this._debug)
				console.debug(
					`${this.debugName} - stop (${this._realtimeUpdating.get()}:${
						this._observedRefCount
					})`
				);
			this._onSnapshotUnsubscribe();
			this._onSnapshotUnsubscribe = undefined;
		}
	}

	/**
	 * @private
	 */
	get debugName(): string {
		return `${this._debugName || this.constructor.name} (${this.path})`;
	}
}

export default Document;
