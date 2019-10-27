import * as React from 'react';

export default class MapRect extends React.PureComponent {
	static defaultProps = {
		bounds: null,
		maps: null,
		map: null,
		color: '#FF0000'
	};
	rectangle = null;

	componentWillUnmount() {
		if (this.rectangle) {
			this.rectangle.setMap(null);
		}
	}

	render() {
		const { map, maps, bounds, color } = this.props;
		if (!maps || !map || !bounds) return null;

		if (!this.rectangle) {
			this.rectangle = new maps.Rectangle({
				map,
				strokeColor: color,
				strokeOpacity: 0.7,
				strokeWeight: 2,
				fillColor: color,
				fillOpacity: 0.25
			});
		}

		this.rectangle.setOptions({
			bounds
		});

		return null;
	}
}
