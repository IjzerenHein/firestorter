export default class MapLabel {
	constructor(options) {
		const { maps, ...otherOptions } = options;
		this.marker = new maps.Marker({
			...otherOptions
			/*icon: {
				url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
			}*/
		});
	}

	setOptions(options) {
		const { maps, color, ...otherOptions } = options;
		this.marker.setOptions(otherOptions);
	}

	setMap(map) {
		this.marker.setMap(map);
	}
}
