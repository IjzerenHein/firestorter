import * as React from 'react';
import MapLabel from './MapLabel';

export default class MapRect extends React.PureComponent {
	static defaultProps = {
		bounds: null,
		maps: null,
		map: null,
		color: '#FF0000',
		label: null,
		labelColor: '#FFFFFF'
	};
	rectangle = null;
	label = null;

	componentWillUnmount() {
		if (this.rectangle) {
			this.rectangle.setMap(null);
			this.rectangle = null;
		}
		if (this.label) {
			this.label.setMap(null);
			this.label = null;
		}
	}

	render() {
		const { map, maps, bounds, color, label, labelColor } = this.props;
		if (!maps || !map || !bounds) return null;

		if (!this.rectangle) {
			this.rectangle = new maps.Rectangle({
				map,
				bounds,
				strokeColor: color,
				strokeOpacity: 0.7,
				strokeWeight: 2,
				fillColor: color,
				fillOpacity: 0.25
			});
		} else {
			this.rectangle.setOptions({
				bounds,
				strokeColor: color,
				fillColor: color
			});
		}

		if (label) {
			const position = {
				lat: bounds.south,
				lng: bounds.east
			};
			if (!this.label) {
				this.label = new MapLabel({
					maps,
					map,
					position,
					label,
					color: labelColor
				});
			} else {
				this.label.setOptions({
					position,
					text: label,
					color: labelColor
				});
			}
		}

		return null;
	}
}
