import * as React from 'react';

export default class MapMarker extends React.PureComponent {
	static defaultProps = {
		location: null,
		maps: null,
		map: null,
		color: '#FF0000'
	};
	marker = null;

	componentWillUnmount() {
		if (this.marker) {
			this.marker.setMap(null);
		}
	}

	render() {
		const { map, maps, location } = this.props;
		if (!maps || !map || !location) return null;

		const position = {
			lat: location.latitude,
			lng: location.longitude
		};

		if (!this.marker) {
			this.marker = new maps.Marker({
				map,
				position
			});
		} else {
			this.marker.setOptions({
				position
			});
		}

		return null;
	}
}
