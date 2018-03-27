// @flow
import { observable, getAtom, _isComputingDerivation } from 'mobx';

/**
 * @private
 * Creates an observable which calls addObserverRef &
 * releaseObserverRef methods on the passed-in delegate class.
 * Effecitively, this allows Firestorter to track whether
 * a Collection/Document is observed and real-time updating
 * needs to be enabled on it.
 */
function enhancedObservable(data: any, delegate: any): any {
	const o = Array.isArray(data)
		? observable.array(data)
		: observable.box(data);

	// Hook into the MobX observable and track
	// Whether any Component is observing this observable.
	const atom = getAtom(o);
	const onBecomeUnobserved = atom.onBecomeUnobserved;
	const reportObserved = atom.reportObserved;
	let isObserved = false;
	atom.isPendingUnobservation = false;
	atom.onBecomeUnobserved = () => {
		const res = onBecomeUnobserved.apply(atom, arguments);
		if (isObserved) {
			isObserved = false;
			delegate.releaseObserverRef();
		}
		return res;
	};
	atom.reportObserved = () => {
		const res = reportObserved.apply(atom, arguments);
		if (!isObserved && _isComputingDerivation()) {
			isObserved = true;
			delegate.addObserverRef();
		}
		return res;
	};

	return o;
}

export { enhancedObservable };
