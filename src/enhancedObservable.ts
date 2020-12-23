import { observable, onBecomeObserved, onBecomeUnobserved } from 'mobx';

import { IEnhancedObservableDelegate } from './Types';

/**
 * @ignore
 * Creates an observable which calls addObserverRef &
 * releaseObserverRef methods on the passed-in delegate class.
 * Effectively, this allows Firestorter to track whether
 * a Collection/Document is observed and real-time updating
 * needs to be enabled on it.
 */
export function enhancedObservable(data: any, delegate: IEnhancedObservableDelegate): any {
  const o = Array.isArray(data) ? observable.array(data) : observable.box(data);
  let isObserved = false;
  onBecomeUnobserved(o, undefined, () => {
    if (isObserved) {
      isObserved = false;
      delegate.releaseObserverRef();
    }
  });
  onBecomeObserved(o, undefined, () => {
    if (!isObserved) {
      isObserved = true;
      delegate.addObserverRef();
    }
  });
  return o;
}
