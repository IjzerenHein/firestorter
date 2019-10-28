import * as React from 'react';
import GoogleMapReact from 'google-map-react';
import { observer } from 'mobx-react';
import './App.css';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import {
	initFirestorter,
	GeoQuery,
	flattenGeohashes,
	decodeGeohash
} from 'firestorter';
import firebaseConfig from './firebaseConfig';
import MapRect from './MapRect';
import MapMarker from './MapMarker';

firebase.initializeApp(firebaseConfig);
initFirestorter({ firebase });

const initProps = {
	bootstrapURLKeys: {
		key: 'AIzaSyDgDX7GD9b8h8JxEB-ANs9LjlRkXpYpS3U'
	},
	defaultCenter: {
		lat: 51.6846154,
		lng: 4.8086858
	},
	defaultZoom: 1
};

export default observer(
	class App extends React.Component {
		state = {
			maps: null,
			map: null,
			bounds: null,
			geoQuery: new GeoQuery('chocolateBars', {
				debug: true
			})
		};

		onRegionChange = event => {
			const { maps, geoQuery } = this.state;
			if (!maps) return;
			const { bounds, center } = event;

			// Calculate region
			const span = new maps.LatLngBounds(bounds.sw, bounds.ne).toSpan();
			const latDelta = span.lat() * 0.1;
			const lngDelta = span.lng() * 0.1;

			// Update query-bounds state
			const newBounds = {
				east: center.lng + lngDelta,
				west: center.lng - lngDelta,
				north: center.lat - latDelta,
				south: center.lat + latDelta
			};
			this.setState({
				bounds: newBounds
			});

			// Update geo-query
			geoQuery.region = {
				latitude: center.lat,
				longitude: center.lng,
				latitudeDelta: latDelta * 2,
				longitudeDelta: lngDelta * 2
			};
		};

		onGoogleApiLoaded = event => {
			this.setState({
				map: event.map,
				maps: event.maps
			});
		};

		render() {
			const { bounds, map, maps, geoQuery } = this.state;
			const { docs, geohashes } = geoQuery;
			const flattenedGeohashes = flattenGeohashes(geohashes);
			console.log(geohashes);
			return (
				<div className="App">
					<GoogleMapReact
						{...initProps}
						yesIWantToUseGoogleMapApiInternals
						onGoogleApiLoaded={this.onGoogleApiLoaded}
						onChange={this.onRegionChange}
					>
						<MapRect maps={maps} map={map} color="red" bounds={bounds} />
						{flattenedGeohashes.map(geohash => {
							const [sw, ne] = decodeGeohash(geohash);
							const bounds = {
								east: ne.longitude,
								west: sw.longitude,
								north: ne.latitude,
								south: sw.latitude
							};
							return (
								<MapRect
									key={geohash}
									maps={maps}
									map={map}
									bounds={bounds}
									color="blue"
									label={geohash}
									labelColor="white"
								/>
							);
						})}
						{docs.map(doc => (
							<MapMarker
								key={doc.id}
								maps={maps}
								map={map}
								location={doc.data.location}
							/>
						))}
					</GoogleMapReact>
				</div>
			);
		}
	}
);
