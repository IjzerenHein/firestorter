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

	componentWillUnmount() {
		if (this.rectangle) {
			this.rectangle.setMap(null);
		}
		if (this.label) {
			console.log('remove');
			this.label.setMap(null);
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

		/*if (label) {
			const position = {
				lat: bounds.north,
				lng: bounds.west
			};
			if (!this.label) {
				if (!MapLabel.isInitialized) {
					MapLabel.prototype = new maps.OverlayView();
					MapLabel.isInitialized = true;
				}
				this.label = new MapLabel({
					map,
					position,
					text: label,
					color: labelColor
				});
			} else {
				this.label.setOptions({
					position,
					text: label,
					color: labelColor
				});
			}
		}*/

		return null;
	}
}
