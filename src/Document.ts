import type Firebase from 'firebase';
import { observable, reaction, toJS, runInAction, IObservableValue } from 'mobx';

import {
  DocumentSource,
  ICollectionDocument,
  // IDocument,
  IDocumentOptions,
  IEnhancedObservableDelegate,
  Mode,
} from './Types';
import { mergeUpdateData, verifyMode } from './Utils';
import { enhancedObservable } from './enhancedObservable';
import { getFirestore, IContext, IHasContext } from './init';

const isEqual = require('lodash.isequal');

/**
 * @private
 */
function resolveRef(
  value: DocumentSource,
  hasContext: IHasContext
): Firebase.firestore.DocumentReference | undefined {
  if (typeof value === 'string') {
    return getFirestore(hasContext).doc(value);
  } else if (typeof value === 'function') {
    return resolveRef(value(), hasContext);
  } else {
    return value;
  }
}

const EMPTY_OPTIONS = {};

/**
 * Document represents a document stored in the firestore database.
 * Document is observable so that it can be efficiently linked to for instance
 * a React Component using `mobx-react`'s `observer` pattern. This ensures that
 * a component is only re-rendered when data that is accessed in the `render`
 * function has changed.
 *
 * @param {DocumentSource} [source] String-path, ref or function that returns a path or ref
 * @param {Object} [options] Configuration options
 * @param {String} [options.mode] See `Document.mode` (default: auto)
 * @param {Function} [options.schema] Superstruct schema for data validation
 * @param {firestore.DocumentSnapshot} [options.snapshot] Initial document snapshot
 * @param {firestore.SnapshotOptions} [options.snapshotOptions] Options that configure how data is retrieved from a snapshot
 * @param {boolean} [options.debug] Enables debug logging
 * @param {String} [options.debugName] Name to use when debug logging is enabled
 */
class Document<T extends object = object>
  implements ICollectionDocument, IEnhancedObservableDelegate, IHasContext {
  private sourceInput: DocumentSource;
  private sourceDisposerFn: () => void;
  private refObservable: IObservableValue<any>;
  private snapshotObservable: IObservableValue<Firebase.firestore.DocumentSnapshot | undefined>;
  private snapshotOptions: Firebase.firestore.SnapshotOptions;
  private docSchema: (data: object) => object;
  private isVerbose: boolean;
  private debugInstanceName?: string;
  private collectionRefCount: number;
  private observedRefCount: number;
  private dataObservable: IObservableValue<T>;
  private modeObservable: IObservableValue<Mode>;
  private isLoadingObservable: IObservableValue<boolean>;
  private onSnapshotUnsubscribeFn: () => void;
  private readyPromise?: Promise<void>;
  private readyResolveFn?: () => void;
  private ctx?: IContext;

  constructor(source?: DocumentSource, options: IDocumentOptions = {}) {
    const { schema, snapshot, snapshotOptions, mode, debug, debugName, context } = options;
    this.debugInstanceName = debugName;
    this.sourceInput = source;
    this.ctx = context;
    this.refObservable = observable.box(resolveRef(source, this));
    this.docSchema = schema;
    this.isVerbose = debug || false;
    this.snapshotObservable = enhancedObservable(snapshot, this);
    this.snapshotOptions = snapshotOptions;
    this.collectionRefCount = 0;
    this.observedRefCount = 0;
    let data = snapshot ? snapshot.data(this.snapshotOptions) : undefined;
    if (data) {
      data = this._validateSchema(data);
    }
    this.dataObservable = enhancedObservable(data || EMPTY_OPTIONS, this);
    this.modeObservable = observable.box(verifyMode(mode || Mode.Auto));
    this.isLoadingObservable = observable.box(false);
    this._updateSourceObserver();
    if (mode === Mode.On) {
      runInAction(() => this._updateRealtimeUpdates());
    }
  }

  /**
   * Returns the superstruct schema used to validate the
   * document, or undefined.
   *
   * @type {Function}
   */
  public get schema(): (data: any) => any {
    return this.docSchema;
  }

  /**
   * Returns the data inside the firestore document.
   *
   * @type {Object}
   *
   * @example
   * todos.docs.map((doc) => {
   *   console.log(doc.data);
   *   // {
   *   //   finished: false
   *   //   text: 'Must do this'
   *   // }
   * });
   */
  public get data(): T {
    return this.dataObservable.get();
  }

  /**
   * True whenever the document has fetched any data.
   *
   * @type {boolean}
   */
  public get hasData(): boolean {
    const { snapshot } = this;
    return !!snapshot && snapshot.exists;
  }

  /**
   * Firestore document reference.
   *
   * Use this property to get or set the
   * underlying document reference.
   *
   * Alternatively, you can also use `path` to change the
   * reference in more a readable way.
   *
   * @type {firestore.DocumentReference | Function}
   *
   * @example
   * const doc = new Document('albums/splinter');
   *
   * // Get the DocumentReference for `albums/splinter`
   * const ref = doc.ref;
   *
   * // Switch to another document
   * doc.ref = firebase.firestore().doc('albums/americana');
   */
  public get ref(): Firebase.firestore.DocumentReference | undefined {
    return this.refObservable.get();
  }
  public set ref(ref: Firebase.firestore.DocumentReference | undefined) {
    this.source = ref;
  }

  /**
   * Id of the firestore document.
   *
   * To get the full-path of the document, use `path`.
   *
   * @type {string}
   */
  public get id(): string | undefined {
    const ref = this.refObservable.get();
    return ref ? ref.id : undefined;
  }

  /**
   * Path of the document (e.g. 'albums/blackAlbum').
   *
   * Use this property to switch to another document in
   * the back-end. Effectively, it is a more compact
   * and readable way of setting a new ref.
   *
   * @type {string | Function}
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
  public get path(): string | (() => string | undefined) | undefined {
    // if we call toString() during initialization, eg to throw an error referring to this
    // document, this would throw an undefined error without the guard.
    let ref = this.refObservable?.get();
    if (!ref) {
      return undefined;
    }
    let path = ref.id;
    while (ref.parent) {
      path = ref.parent.id + '/' + path;
      ref = ref.parent;
    }
    return path;
  }
  public set path(documentPath: string | (() => string | undefined) | undefined) {
    this.source = documentPath;
  }

  /**
   * @private
   */
  public get source(): DocumentSource {
    return this.sourceInput;
  }
  public set source(source: DocumentSource) {
    if (this.collectionRefCount) {
      throw new Error('Cannot change source on Document that is controlled by a Collection');
    }
    if (this.sourceInput === source) {
      return;
    }
    this.sourceInput = source;
    this._updateSourceObserver();
    runInAction(() => {
      this.refObservable.set(resolveRef(source, this));
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
   *
   * @type {string}
   */
  public get mode(): Mode {
    return this.modeObservable.get();
  }
  public set mode(mode: Mode) {
    if (this.modeObservable.get() === mode) {
      return;
    }
    verifyMode(mode);
    runInAction(() => {
      this.modeObservable.set(mode);
      this._updateRealtimeUpdates();
    });
  }

  /**
   * Returns true when the Document is actively listening
   * for changes in the firestore back-end.
   *
   * @type {boolean}
   */
  public get isActive(): boolean {
    return !!this.onSnapshotUnsubscribeFn;
  }

  /**
   * Underlying firestore snapshot.
   *
   * @type {firestore.DocumentSnapshot}
   */
  public get snapshot(): Firebase.firestore.DocumentSnapshot | undefined {
    return this.snapshotObservable.get();
  }

  /**
   * Updates one or more fields in the document.
   *
   * The update will fail if applied to a document that does
   * not exist.
   *
   * @param {Object} fields - Fields to update
   * @return {Promise}
   *
   * @example
   * await todoDoc.update({
   *   finished: true,
   *   text: 'O yeah, checked this one off',
   *   foo: {
   *     bar: 10
   *   }
   * });
   */
  public update(fields: object): Promise<void> {
    const ref = this.refObservable.get();
    if (this.docSchema) {
      if (!this.snapshot) {
        console.warn(
          `${this.debugName} - Unable to verify schema in .update() because the document has not been fetched yet`
        );
      } else {
        try {
          this._validateSchema(mergeUpdateData(toJS(this.data), fields));
        } catch (err) {
          return Promise.reject(err);
        }
      }
    }
    return ref.update(fields);
  }

  /**
   * Writes to the document.
   *
   * If the document does not exist yet, it will be created.
   * If you pass options, the provided data can be merged into
   * the existing document.
   *
   * @param {Object} data - An object of the fields and values for the document
   * @param {Object} [options] - Set behaviour options
   * @param {Boolean} [options.merge] - Set to `true` to only replace the values specified in the data argument. Fields omitted will remain untouched.
   * @return {Promise}
   *
   * @example
   * const todo = new Document('todos/mynewtodo');
   * await todo.set({
   *   finished: false,
   *   text: 'this is awesome'
   * });
   */
  public set(data: any, options?: any): Promise<void> {
    if (this.docSchema) {
      try {
        if (options?.merge) {
          this._validateSchema(mergeUpdateData(toJS(this.data), data));
        } else {
          this._validateSchema(data);
        }
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return this.refObservable.get().set(data, options);
  }

  /**
   * Deletes the document in Firestore.
   *
   * Returns a promise that resolves once the document has been
   * successfully deleted from the backend (Note that it won't
   * resolve while you're offline).
   *
   * @return {Promise}
   */
  public delete(): Promise<void> {
    return this.refObservable.get().delete();
  }

  /**
   * Fetches new data from firestore. Use this to manually fetch
   * new data when `mode` is set to 'off'.
   *
   * @return {Promise}
   * @fullfil {Document<T>} This document
   *
   * @example
   * const doc = new Document('albums/splinter');
   * await doc.fetch();
   * console.log('data: ', doc.data);
   */
  public async fetch(): Promise<Document<T>> {
    if (this.isVerbose) {
      console.debug(`${this.debugName} - fetching...`);
    }
    if (this.collectionRefCount) {
      throw new Error('Should not call fetch on Document that is controlled by a Collection');
    }
    if (this.isActive) {
      throw new Error('Should not call fetch when real-time updating is active');
    }
    if (this.isLoadingObservable.get()) {
      throw new Error('Fetch already in progress');
    }
    const ref = this.refObservable.get();
    if (!ref) {
      throw new Error('No ref or path set on Document');
    }
    runInAction(() => {
      this._ready(false);
      this.isLoadingObservable.set(true);
    });
    try {
      const snapshot = await ref.get();
      runInAction(() => {
        this.isLoadingObservable.set(false);
        this._updateFromSnapshot(snapshot);
        if (this.isVerbose) {
          console.debug(`${this.debugName} - fetched: ${JSON.stringify(toJS(this.data))}`);
        }
      });
      this._ready(true);
    } catch (err) {
      console.log(`${this.debugName} - fetch failed: ${err.message}`);
      runInAction(() => {
        this.isLoadingObservable.set(false);
        this._updateFromSnapshot(undefined);
        this._ready(true);
      });
      throw err;
    }
    return this;
  }

  /**
   * True when new data is being loaded.
   *
   * Loads are performed in these cases:
   *
   * - When real-time updating is started
   * - When a different `ref` or `path` is set
   * - When a `query` is set or cleared
   * - When `fetch` is explicitly called
   *
   * @type {boolean}
   *
   * @example
   * const doc = new Document('albums/splinter', {mode: 'off'});
   * console.log(doc.isLoading); 	// false
   * doc.fetch(); 								// start fetch
   * console.log(doc.isLoading); 	// true
   * await doc.ready(); 					// wait for fetch to complete
   * console.log(doc.isLoading); 	// false
   *
   * @example
   * const doc = new Document('albums/splinter');
   * console.log(doc.isLoading); 	// false
   * const dispose = autorun(() => {
   *   console.log(doc.data);			// start observing document data
   * });
   * console.log(doc.isLoading); 	// true
   * ...
   * dispose();										// stop observing document data
   * console.log(doc.isLoading); 	// false
   */
  public get isLoading(): boolean {
    this.dataObservable.get(); // access data
    return this.isLoadingObservable.get();
  }

  /**
   * True when a snapshot has been obtained from the Firestore
   * back-end. This property indicates whether an initial fetch/get call
   * to Firestore has completed processing. This doesn't however mean that data
   * is available, as the returned snapshot may contain a value indicating
   * that the document doesn't exist. Use `hasData` to check whether any
   * data was succesfully retrieved.
   *
   * @type {boolean}
   */
  public get isLoaded(): boolean {
    const { snapshot } = this;
    return !!snapshot;
  }

  /**
   * Promise that is resolved when the Document has
   * data ready to be consumed.
   *
   * Use this function to for instance wait for
   * the initial snapshot update to complete, or to wait
   * for fresh data after changing the path/ref.
   *
   * @return {Promise}
   *
   * @example
   * const doc = new Document('albums/splinter', {mode: 'on'});
   * await doc.ready();
   * console.log('data: ', doc.data);
   *
   * @example
   * const doc = new Document('albums/splinter', {mode: 'on'});
   * await doc.ready();
   * ...
   * // Changing the path causes a new snapshot update
   * doc.path = 'albums/americana';
   * await doc.ready();
   * console.log('data: ', doc.data);
   */
  public ready(): Promise<void> {
    this.readyPromise = this.readyPromise || Promise.resolve();
    return this.readyPromise;
  }

  public toString(): string {
    return this.debugName;
  }

  /**
   * @private
   */
  public get debugName(): string {
    return `${this.debugInstanceName || this.constructor.name} (${this.path})`;
  }

  /**
   * @private
   */
  public get context(): IContext {
    return this.ctx;
  }

  /**
   * Called whenever a property of this class becomes observed.
   * @private
   */
  public addObserverRef(): number {
    if (this.isVerbose) {
      console.debug(`${this.debugName} - addRef (${this.observedRefCount + 1})`);
    }
    const res = ++this.observedRefCount;
    if (res === 1) {
      runInAction(() => this._updateRealtimeUpdates());
    }
    return res;
  }

  /**
   * Called whenever a property of this class becomes un-observed.
   * @private
   */
  public releaseObserverRef(): number {
    if (this.isVerbose) {
      console.debug(`${this.debugName} - releaseRef (${this.observedRefCount - 1})`);
    }
    const res = --this.observedRefCount;
    if (!res) {
      runInAction(() => this._updateRealtimeUpdates());
    }
    return res;
  }

  /**
   * ICollectionDocument
   * @private
   */
  public addCollectionRef(): number {
    return ++this.collectionRefCount;
  }
  public releaseCollectionRef(): number {
    return --this.collectionRefCount;
  }
  public updateFromCollectionSnapshot(snapshot: Firebase.firestore.DocumentSnapshot): void {
    return this._updateFromSnapshot(snapshot);
  }

  /**
   * @private
   */
  public _updateFromSnapshot(snapshot?: Firebase.firestore.DocumentSnapshot): void {
    let data: any = snapshot ? snapshot.data(this.snapshotOptions) : undefined;
    if (data) {
      data = this._validateSchema(data);
    } else {
      data = {};
    }
    this.snapshotObservable.set(snapshot);

    if (!isEqual(data, this.dataObservable.get())) {
      this.dataObservable.set(data);
    }
  }

  /**
   * @private
   */
  protected _ready(complete) {
    if (complete) {
      const readyResolve = this.readyResolveFn;
      if (readyResolve) {
        this.readyResolveFn = undefined;
        readyResolve();
      }
    } else if (!this.readyResolveFn) {
      this.readyPromise = new Promise((resolve) => {
        this.readyResolveFn = resolve;
      });
    }
  }

  /**
   * @private
   */
  protected _onSnapshot(snapshot: Firebase.firestore.DocumentSnapshot) {
    runInAction(() => {
      if (this.isVerbose) {
        console.debug(`${this.debugName} - onSnapshot`);
      }
      this.isLoadingObservable.set(false);
      try {
        this._updateFromSnapshot(snapshot);
      } catch (err) {
        console.error(err.message);
      }
      this._ready(true);
    });
  }

  /**
   * @private
   */
  protected _onSnapshotError(error: Error): void {
    console.warn(`${this.debugName} - onSnapshotError: ${error.message}`);
  }

  /**
   * @private
   */
  private _updateRealtimeUpdates(force?: boolean): void {
    let newActive = false;
    switch (this.modeObservable.get()) {
      case Mode.Auto:
        newActive = !!this.observedRefCount;
        break;
      case Mode.Off:
        newActive = false;
        break;
      case Mode.On:
        newActive = true;
        break;
    }

    // Start/stop listening for snapshot updates
    if (this.collectionRefCount || !this.refObservable.get()) {
      newActive = false;
    }
    const active = !!this.onSnapshotUnsubscribeFn;
    if (newActive && (!active || force)) {
      if (this.isVerbose) {
        console.debug(
          `${this.debugName} - ${active ? 're-' : ''}start (${this.modeObservable.get()}:${
            this.observedRefCount
          })`
        );
      }
      this._ready(false);
      this.isLoadingObservable.set(true);
      if (this.onSnapshotUnsubscribeFn) {
        this.onSnapshotUnsubscribeFn();
      }
      this.onSnapshotUnsubscribeFn = this.refObservable.get().onSnapshot(
        (snapshot) => this._onSnapshot(snapshot),
        (err) => this._onSnapshotError(err)
      );
    } else if (!newActive && active) {
      if (this.isVerbose) {
        console.debug(
          `${this.debugName} - stop (${this.modeObservable.get()}:${this.observedRefCount})`
        );
      }
      this.onSnapshotUnsubscribeFn();
      this.onSnapshotUnsubscribeFn = undefined;
      if (this.isLoadingObservable.get()) {
        this.isLoadingObservable.set(false);
      }
      this._ready(true);
    }
  }

  /**
   * @private
   */
  private _updateSourceObserver() {
    if (this.sourceDisposerFn) {
      this.sourceDisposerFn();
      this.sourceDisposerFn = undefined;
    }
    if (typeof this.sourceInput === 'function') {
      this.sourceDisposerFn = reaction(
        () =>
          (this.sourceInput as () => Firebase.firestore.DocumentReference | string | undefined)(),
        (value) => {
          runInAction(() => {
            // TODO, check whether path has changed
            this.refObservable.set(resolveRef(value, this));
            this._updateRealtimeUpdates(true);
          });
        }
      );
    }
  }

  /**
   * @private
   */
  private _validateSchema(data: any): T {
    if (!this.docSchema) {
      return data;
    }
    try {
      data = this.docSchema(data);
    } catch (err) {
      // console.log(JSON.stringify(err));

      throw new Error(
        'Invalid value at "' +
          err.path +
          '" for ' +
          (this.debugInstanceName || this.constructor.name) +
          ' with id "' +
          this.id +
          '": ' +
          err.message
      );
    }
    return data;
  }
}

export default Document;
