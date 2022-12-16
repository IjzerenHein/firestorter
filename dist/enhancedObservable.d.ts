import { IEnhancedObservableDelegate } from './Types';
/**
 * @ignore
 * Creates an observable which calls addObserverRef &
 * releaseObserverRef methods on the passed-in delegate class.
 * Effectively, this allows Firestorter to track whether
 * a Collection/Document is observed and real-time updating
 * needs to be enabled on it.
 */
export declare function enhancedObservable(data: any, delegate: IEnhancedObservableDelegate): any;
