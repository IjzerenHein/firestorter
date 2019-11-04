# Creating stores

When creating an application you need to think about how
to structure your data. When a Collection is used in multiple
React Components, it can be useful to put it in a shared store. The
following example shows a simple store with collections and a
document.

## Store.js

```js
import firebase from 'firebase';
import 'firebase/firestore';
import {initFirestorter, Collection, Document} from 'firestorter';

firebase.initializeApp({
  ...
});

initFirestorter({firebase: firebase});

const store = {
  artists: new Collection('artists'),		 // by default, mode is set to `auto`
  settings: new Collection('settings', { // permanently enable real-time updating
  	mode: 'on'						               // regardless of whether the collection
  }), 																	 // is being used or rendered.
  albums: new Collection(),           	 // uninitialized collection
  currentUser: new Document()
  ...
};

export store;
```

## Artists.js

When `ArtistsView` is mounted, real-time updating is automatically enabled on the `artists` collection
because its `mode` property is set to `auto` (=default).

```js
import { artists, albums } from './store';
import { observer } from 'mobx-react';

// Use @observer decorator
@observer
class ArtistsView extends Component {
	render() {
		return <div>{artists.map(doc => <ArtistView artist={doc} />)}</div>;
	}
}

// Or wrap component with observer
const ArtistView = observer(
	class ArtistView extends Component {
		static propTypes = {
			artist: PropTypes.object
		};

		render() {
			const { artist } = this.props;
			const { name, imageUrl } = artist;
			return (
				<div onClick={this.onClick}>
					<span>{name}</span>
					<img src={imageUrl} />
				</div>
			);
		}

		onClick = () => {
			const { artist } = this.props;
			// Switch albums to this artist
			albums.path = 'artists/' + artist.id + '/albums';
		};
	}
);
```

## Albums.js

In `Artists.js`, whenever an album is clicked, the `albums` collection is
switched to a new Firestore colllection reference. When AlbumView is visible
or becomes visible, it will automatically update to show that data from
back-end, as efficiently as possible.

```js
import {albums} from './store';
import {observer} from 'mobx-react';

class AlbumView extends Component {
  render() {
    return (
      <div>
        {albums.map((doc) => <AlbumView album={doc} />)}
      </div>
    );
  }
}

export default observer(AlbumView);
```
