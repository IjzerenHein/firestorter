import {
	runInAction,
	observable,
	decorate,
	computed,
	IObservableValue
} from "mobx";
import { CollectionSource, ICollectionDocument } from "./Types";
import { IGeoRegion, getGeohashesForRegion } from "./GeoHash";
import AggregateCollection, {
	IAggregateCollectionOptions,
	IAggregateCollectionQuery
} from "./AggregateCollection";

export type GeoQueryRegion = IGeoRegion | (() => IGeoRegion | void) | void;
export type GeoQueryHash = string[];

export interface IGeoQueryQuery extends IAggregateCollectionQuery {
	geoHash: GeoQueryHash;
}

export interface IGeoQueryOptions<T>
	extends IAggregateCollectionOptions<T, IGeoQueryQuery> {
	region?: GeoQueryRegion;
	filterBy?: (doc: T, region?: IGeoRegion | void) => boolean;
}

export class GeoQuery<
	T extends ICollectionDocument
> extends AggregateCollection<T, IGeoQueryQuery> {
	private regionObservable: IObservableValue<GeoQueryRegion>;

	constructor(source: CollectionSource, options: IGeoQueryOptions<T>) {
		const { region, filterBy, ...otherOptions } = options;
		const regionObservable = observable.box(region);
		super(source, {
			filterBy: filterBy
				? (doc: T) => {
						let regionVal = regionObservable.get();
						regionVal =
							typeof regionVal === "function" ? regionVal() : regionVal;
						return filterBy(doc, regionVal);
				  }
				: undefined,
			getQueries: () => {
				let regionVal = regionObservable.get();
				regionVal = typeof regionVal === "function" ? regionVal() : regionVal;
				const geoHashes = regionVal
					? getGeohashesForRegion(regionVal)
					: undefined;
				if (!geoHashes) {
					return null;
				}
				return geoHashes.map(geoHash => ({
					geoHash,
					key: `${geoHash[0]}-${geoHash[1]}`,
					query: ref =>
						ref
							.where("geoHash", ">=", geoHash[0])
							.where("geoHash", "<", geoHash[1])
				}));
			},

			...otherOptions
		});
		this.regionObservable = regionObservable;
	}

	get region(): GeoQueryRegion {
		return this.regionObservable.get();
	}
	set region(val: GeoQueryRegion) {
		runInAction(() => this.regionObservable.set(val));
	}

	get geohashes(): GeoQueryHash[] {
		const queries = this.getQueries();
		return queries ? queries.map(query => query.geoHash) : [];
	}
}

decorate(GeoQuery, { geohashes: computed });

export default GeoQuery;
