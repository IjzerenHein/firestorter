import { _isComputingDerivation, getAtom, observable } from 'mobx';

import { IEnhancedObservableDelegate } from './Types';

/**
 * @ignore
 * Creates an observable which calls addObserverRef &
 * releaseObserverRef methods on the passed-in delegate class.
 * Effecitively, this allows Firestorter to track whether
 * a Collection/Document is observed and real-time updating
 * needs to be enabled on it.
 */
export function enhancedObservable(data: any, delegate: IEnhancedObservableDelegate): any {
  const o = Array.isArray(data) ? observable.array(data) : observable.box(data);

  // Hook into the MobX observable and track
  // Whether any Component is observing this observable.
  const atom: any = getAtom(o);
  const onBecomeUnobserved = atom.onBecomeUnobserved;
  const reportObserved = atom.reportObserved;
  let isObserved = false;
  atom.isPendingUnobservation = false;
  atom.onBecomeUnobserved = () => {
    // eslint-disable-next-line prefer-rest-params
    const res = onBecomeUnobserved.apply(atom, arguments);
    if (isObserved) {
      isObserved = false;
      delegate.releaseObserverRef();
    }
    return res;
  };
  atom.reportObserved = () => {
    // eslint-disable-next-line prefer-rest-params
    const res = reportObserved.apply(atom, arguments);
    if (!isObserved && _isComputingDerivation()) {
      isObserved = true;
      delegate.addObserverRef();
    }
    return res;
  };

  return o;
}
