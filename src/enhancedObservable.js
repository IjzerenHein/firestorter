// @flow
import {observable} from 'mobx';

function enhancedObservable(data: any, delegate: any): any {
	const o = (!Array.isArray(data) && (typeof data === 'object')) ? observable.box(data) : observable(data);

	// Hook into the MobX observable and track
	// Whether any Component is observing this observable.
	let atom = o;
	if (Array.isArray(data)) {
		atom = o.$mobx.atom;
	}
	atom = atom || o;
	const onBecomeUnobserved = atom.onBecomeUnobserved;
	const reportObserved = atom.reportObserved;
	let isObserved = false;
	atom.isPendingUnobservation = false;
	atom.onBecomeUnobserved = () => {
		const res = onBecomeUnobserved.apply(atom, arguments);
		isObserved = false;
		delegate.releaseObserverRef();
		return res;
	};
	atom.reportObserved = () => {
		const res = reportObserved.apply(atom, arguments);
		if (!isObserved) {
			isObserved = true;
			delegate.addObserverRef();
		}
		return res;
	};

	return o;
}

export {
	enhancedObservable
};
