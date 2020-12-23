import type Firebase from 'firebase';
import { runInAction, autorun, computed, makeObservable, IObservableArray } from 'mobx';

import Collection from './Collection';
import Document from './Document';
import {
  ICollection,
  DocumentSource,
  IDocumentOptions,
  CollectionSource,
  ICollectionDocument,
  IEnhancedObservableDelegate,
} from './Types';
import { enhancedObservable } from './enhancedObservable';
import { IContext, IHasContext } from './init';

const isEqual = require('lodash.isequal');

export type AggregateCollectionOrderBy<T> = (a: T, b: T) => number;
export type AggregateCollectionFilterBy<T> = (doc: T) => boolean;
export interface IAggregateCollectionQuery {
  key: string;
  query: (
    ref: Firebase.firestore.CollectionReference
  ) => Firebase.firestore.Query | null | undefined;
}
export type AggregateCollectionQueries<Y> = Y[] | null;
export type AggregateCollectionQueriesFn<
  Y extends IAggregateCollectionQuery
> = () => AggregateCollectionQueries<Y>;

export interface IAggregateCollectionOptions<T, Y extends IAggregateCollectionQuery> {
  queries: AggregateCollectionQueriesFn<Y>;
  createDocument?: (source: DocumentSource, options: IDocumentOptions) => T;
  debug?: boolean;
  debugName?: string;
  orderBy?: AggregateCollectionOrderBy<T>;
  filterBy?: AggregateCollectionFilterBy<T>;
  context?: IContext;
}

/**
 * Collection that aggregates documents from multiple queries into
 * a single, easy accessible collection.
 *
 * AggregateCollection is driven by the `queries` function, which defines what
 * queries should be executed on the Firestore cloud back-end. GeoQuery is
 * for instance a more specific use-case of a aggregated-collection using a range
 * of geo-hash queries.
 *
 * @param {CollectionSource} [source] String-path, ref or function that returns a path or ref
 * @param {Object} [options] Configuration options
 * @param {AggregateCollectionQueriesFn} [options.queries] See `AggregateCollection.queries`
 * @param {Function} [options.createDocument] Factory function for creating documents `(source, options) => new Document(source, options)`
 * @param {Function} [options.orderBy] Client side sort function
 * @param {Function} [options.filterBy] Client side filter function
 * @param {boolean} [options.debug] Enables debug logging
 * @param {String} [options.debugName] Name to use when debug logging is enabled
 *
 * @example
 * import {AggregateCollection} from 'firestorter';
 *
 * // Query all unfinished todos for a set of users
 * const userIds = ['pinky', 'brain'];
 * const col = new AggregateCollection('todos', {
 *   queries: () => userIds.map(userId => ({
 *     key: userId, // unique-key by which the query is re-used/cached
 *     query: (ref) => ref.where('userId', '==', userId).where('finished', '==', false)
 *   }))
 * });
 */
class AggregateCollection<
  T extends ICollectionDocument,
  Y extends IAggregateCollectionQuery = IAggregateCollectionQuery
> implements ICollection<T>, IEnhancedObservableDelegate, IHasContext {
  private queriesFn: AggregateCollectionQueriesFn<Y>;
  private collectionSource: CollectionSource;
  private createDocument: (source: DocumentSource, options: IDocumentOptions) => T;
  private orderBy?: AggregateCollectionOrderBy<T>;
  private filterBy?: AggregateCollectionFilterBy<T>;
  private debug: boolean;
  private debugInstanceName?: string;
  private observedRefCount: number = 0;
  private disposer: (() => any) | void;
  private collections: IObservableArray<Collection<T>>;
  private prevCollections: Collection<T>[];
  private collectionRecycleMap: {
    [key: string]: Collection<T>;
  };
  private documentRecycleMap: {
    [key: string]: T;
  };
  private ctx?: IContext;

  constructor(source: CollectionSource, options: IAggregateCollectionOptions<T, Y>) {
    makeObservable(this, {
      docs: computed,
    });

    this.collectionSource = source;
    if (options.createDocument) {
      this.createDocument = options.createDocument;
    } else {
      this.createDocument = (docSource: DocumentSource, docOptions: IDocumentOptions): T =>
        (new Document(docSource, docOptions) as unknown) as T;
    }
    this.queriesFn = options.queries;
    this.orderBy = options.orderBy;
    this.filterBy = options.filterBy;
    this.debug = options.debug || false;
    this.debugInstanceName = options.debugName;
    this.collections = enhancedObservable([], this);
    this.prevCollections = [];
    this.collectionRecycleMap = {};
    this.documentRecycleMap = {};
    this.ctx = options.context;
  }

  /**
   * Array of all the documents that have been fetched
   * from firestore.
   *
   * @type {Array}
   *
   * @example
   * aggregateCollection.docs.forEach((doc) => {
   *   console.log(doc.data);
   * });
   */
  public get docs(): T[] {
    let docs: T[] = [];

    // Aggregrate all docs from the queries
    let hasAllData = true;
    this.collections.forEach((col) => {
      if (col.isLoading) {
        hasAllData = false;
      }
      col.docs.forEach((doc) => docs.push(doc));
    });

    // If new queries have been added but have not yet
    // completed loading, use the previous queries instead
    // (until) all data has loaded
    if (!hasAllData && this.prevCollections.length) {
      // console.log('usingPrevQueries');
      docs = [];
      this.prevCollections.forEach((col) => {
        col.docs.forEach((doc) => docs.push(doc));
      });
    } else if (hasAllData) {
      // console.log('+++ ALL DATA AVAIL');
      this.prevCollections = this.collections.slice(0);
    }

    // console.log('unfilteredDocs: ', docs.length);
    if (this.filterBy) {
      docs = docs.filter(this.filterBy);
    }
    if (this.orderBy) {
      docs.sort(this.orderBy);
    }
    // console.log('docs: ', docs.length);
    return docs;
  }

  /**
   * True whenever any documents have been fetched.
   *
   * @type {boolean}
   */
  public get hasDocs(): boolean {
    return this.docs.length > 0;
  }

  /**
   * Array of all the collections inside this aggregate
   * collection.
   *
   * @type {Array}
   *
   * @example
   * aggregateCollection.cols.forEach((col) => {
   *   console.log(col.docs.length);
   * });
   */
  public get cols(): Collection<T>[] {
    return this.collections;
  }

  /**
   * Queries function.
   *
   * @type {Function}
   */
  public get queries(): AggregateCollectionQueriesFn<Y> {
    return this.queriesFn;
  }

  /**
   * True when new data is being loaded.
   *
   * @type {boolean}
   */
  public get isLoading(): boolean {
    return this.collections.reduce((acc, col) => acc || col.isLoading, false);
  }

  /**
   * True when data for all underlying collections has been loaded.
   *
   * @type {boolean}
   */
  public get isLoaded(): boolean {
    return this.collections.reduce((acc, col) => (acc ? col.isLoaded : false), true);
  }

  /**
   * @private
   */
  public get debugName(): string {
    return `${this.debugInstanceName || this.constructor.name}`;
  }

  public toString(): string {
    return this.debugName;
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
    const res = ++this.observedRefCount;
    if (res === 1) {
      this.disposer = autorun(() => {
        const queries = this.queriesFn();
        runInAction(() => this._updateQueries(queries));
      });
    }
    return res;
  }

  /**
   * Called whenever a property of this class becomes un-observed.
   * @private
   */
  public releaseObserverRef(): number {
    const res = --this.observedRefCount;
    if (res <= 0) {
      if (this.disposer) {
        this.disposer();
        this.disposer = undefined;
      }
    }
    return res;
  }

  /**
   * @private
   */
  private _onCreateDocument = (source: DocumentSource, options: IDocumentOptions) => {
    if (!source) {
      return this.createDocument(source, options);
    }
    // @ts-ignore
    const doc = source.id ? this.documentRecycleMap[source.id] : null;
    return doc || this.createDocument(source, options);
  };

  /**
   * @private
   */
  private _updateQueries(queries: AggregateCollectionQueries<Y>) {
    if (!queries) {
      return;
    }
    if (this.debug) {
      console.debug(this.debugName, 'updateQueries: ', queries);
    }

    // Copy all current documents into the document recyle map
    this.documentRecycleMap = {};
    Object.values(this.collectionRecycleMap).forEach((query) => {
      query.docs.forEach((doc) => {
        this.documentRecycleMap[doc.id] = doc;
      });
    });
    // console.log(Object.keys(this._documentRecycleMap));

    const cols = queries.map((query) => {
      let col = this.collectionRecycleMap[query.key];
      if (!col) {
        col = new Collection(this.collectionSource, {
          createDocument: this._onCreateDocument,
          debug: this.debug,
          debugName: this.debugName + '.col: ' + query.key,
          query: (ref) => (ref ? query.query(ref) : ref),
        });
      }
      return col;
    });

    // Update the query recycle map
    this.collectionRecycleMap = {};
    cols.forEach((col, index) => {
      const query = queries[index];
      this.collectionRecycleMap[query.key] = col;
    });

    // Update the queries
    if (!isEqual(cols, this.collections.slice(0))) {
      this.collections.replace(cols);
    }
  }
}

export default AggregateCollection;
