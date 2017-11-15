### Using Collections and Documents with a store

When creating an application you need to think about how
to structure your data. When a Collection is used in multiple
React  Components, it can be useful to put it in a store. The
following example shows a simple store with collections and a
document.


#### store.js

```js
import firebase from 'firebase';
import 'firebase/firestore';
import {initFirestorter, Collection, Document} from 'firestorter';

firebase.initializeApp({
  ...
});

initFirestorter({firebase: firebase});

const store = {
  settings: new Collection('settings', 'on'), // set real-time updating always on
  artists: new Collection('artists'),	// by default, realtimeUpdating is set to `auto`
  albums: new Collection(),           // uninitialized collection, use path to its location
  currentUser: new Document()
  ...
};

export store;
```

#### Artists.js

When `ArtistsView` is mounted, real-time updating is automatically enabled on the `artists` collection
because its `realtimeUpdating` property is set to `auto`. 

```js
import {artists, albums} from './store';
import {observer} from 'mobx-react';

// Use @observer decorator	
@observer
class ArtistsView extends Component {
  render() {
    return (
      <div>
        {artists.map((doc) => <ArtistView artist={doc} />)}
      </div>
    );
  }
}

// Or wrap component with observer
const ArtistView = observer(class ArtistView extends Component {
  static propTypes = {
    artist: PropTypes.object
  };

  render() {
    const {artist} = this.props;
    const {name, imageUrl} = artist;
    return (
      <div onClick={this.onClick}>
        <span>{name}</span>
        <img src={imageUrl} />
      </div>
    );
  }

  onClick = () => {
    const {artist} = this.props;
    // Switch albums to this artist
    albums.path = 'artists/' + artist.id + '/albums';
  };
});
```

#### Albums.js

```js
import {albums} from './store';
import {observer} from 'mobx-react';

@observer class AlbumView extends Component {
  render() {
    return (
      <div>
        {albums.map((doc) => <AlbumView album={doc} />)}
      </div>
    );
  }
}

...
```
