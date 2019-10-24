import { runInAction, autorun, computed, decorate, IObservableArray } from 'mobx';
import { firestore } from "firebase";
import Collection from './Collection';
import {
  DocumentSource,
  IDocumentOptions,
  CollectionSource,
  ICollectionDocument,
	IEnhancedObservableDelegate
} from './Types';
import {
	IContext,
	IHasContext
} from './init';
import { enhancedObservable } from './enhancedObservable';
const isEqual = require("lodash.isequal"); //tslint:disable-line

export type AggregateCollectionOrderBy<T> = (a: T, b: T) => number;
export type AggregateCollectionFilterBy<T> = (doc: T) => boolean;
export interface IAggregateCollectionQuery {
  key: string,
  query: (ref: firestore.CollectionReference) => firestore.Query | null | undefined,
};
export type AggregateCollectionQueries<Y> = Y[] | null;
export type AggregateCollectionGetQueries<
  Y extends IAggregateCollectionQuery
> = () => AggregateCollectionQueries<Y>;

export interface IAggregateCollectionOptions<T, Y extends IAggregateCollectionQuery> {
  createDocument: (source: DocumentSource, options: IDocumentOptions) => T,
  getQueries: AggregateCollectionGetQueries<Y>,
  debug?: boolean,
  debugName?: string,
  orderBy?: AggregateCollectionOrderBy<T>,
	filterBy?: AggregateCollectionFilterBy<T>,
	context?: IContext
};

export class AggregateCollection<
  T extends ICollectionDocument,
  Y extends IAggregateCollectionQuery = IAggregateCollectionQuery
> implements IEnhancedObservableDelegate, IHasContext {
  private collectionSource: CollectionSource;
  private createDocumentFn: (source: DocumentSource, options: IDocumentOptions) => T;
	private getQueriesFn: AggregateCollectionGetQueries<Y>;
	// @ts-ignore
	private orderBy: ?AggregateCollectionOrderBy<T>;
	// @ts-ignore
  private filterBy: ?AggregateCollectionFilterBy<T>;
  private debug: boolean;
  private debugName: string;
  private observedRefCount: number = 0;
  private disposer: (() => any) | void;
  private queries: IObservableArray<Collection<T>>;
  private prevQueries: Array<Collection<T>>;
  private queryRecycleMap: {
    [key: string]: Collection<T>,
  };
  private documentRecycleMap: {
    [key: string]: T,
	};
	private ctx?: IContext;

  constructor(source: CollectionSource, options: IAggregateCollectionOptions<T, Y>) {
    this.collectionSource = source;
    this.createDocumentFn = options.createDocument;
    this.getQueriesFn = options.getQueries;
    this.orderBy = options.orderBy;
    this.filterBy = options.filterBy;
    this.debug = options.debug || false;
    this.debugName = options.debugName || 'AggregateCollection';
    this.queries = enhancedObservable([], this);
    this.prevQueries = [];
    this.queryRecycleMap = {};
		this.documentRecycleMap = {};
		this.ctx = options.context;
  }

  public get docs(): T[] {
    let docs: T[] = [];

    // Aggregrate all docs from the queries
    let hasAllData = true;
    this.queries.forEach(query => {
      if (query.isLoading) {
				hasAllData = false;
			}
      query.docs.forEach(doc => docs.push(doc));
    });

    // If new queries have been added but have not yet
    // completed loading, use the previous queries instead
    // (until) all data has loaded
    if (!hasAllData && this.prevQueries.length) {
      // console.log('usingPrevQueries');
      docs = [];
      this.prevQueries.forEach(query => {
        query.docs.forEach(doc => docs.push(doc));
      });
    } else if (hasAllData) {
      // console.log('+++ ALL DATA AVAIL');
      this.prevQueries = this.queries.slice(0);
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

  public getQueries(): Y[] | null {
    return this.getQueriesFn();
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
        const queries = this.getQueriesFn();
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
	// tslint:disable-next-line
	private _onCreateDocument = (source: DocumentSource, options: IDocumentOptions) => {
    if (!source) {
			return this.createDocumentFn(source, options);
		}
		// @ts-ignore
    const doc = source.id ? this.documentRecycleMap[source.id] : null;
    return doc || this.createDocumentFn(source, options);
  };

	/**
	 * @private
	 */
	private _updateQueries(queries: AggregateCollectionQueries<Y>) {
    if (!queries) {return};
    if (this.debug) {
			console.debug(this.debugName, 'updateQueries: ', queries);
		}

    // Copy all current documents into the document recyle map
    this.documentRecycleMap = {};
    Object.values(this.queryRecycleMap).forEach(query => {
      query.docs.forEach(doc => {
        this.documentRecycleMap[doc.id] = doc;
      });
    });
    // console.log(Object.keys(this._documentRecycleMap));

    const cols = queries.map(query => {
      let col = this.queryRecycleMap[query.key];
      if (!col) {
        col = new Collection(this.collectionSource, {
          createDocument: this._onCreateDocument,
          debug: this.debug,
          debugName: this.debugName + '.Collection',
          query: ref => (ref ? query.query(ref) : ref),
        });
      }
      return col;
    });

    // Update the query recycle map
    this.queryRecycleMap = {};
    cols.forEach((col, index) => {
      const query = queries[index];
      this.queryRecycleMap[query.key] = col;
    });

    // Update the queries
    if (!isEqual(cols, this.queries.slice(0))) {
      this.queries.replace(cols);
    }
  }
}

decorate(AggregateCollection, { docs: computed });

export default AggregateCollection;
