## Paths & References

### References

At the heart of a `Collection` or `Document`, is a reference to the firestore data.
A reference is an object that is obtained using the Firestore API, like this:
`firebase().firestore().collection(...)` or `firebase().firestore().doc(...)`.

You can access the reference by using the `ref` property on a `Collection` or
`Document`.

```js
import { Collection, Document } from 'firestorter';
import firebase from 'firebase';

// Pass in a reference in the constructor
const albums = new Collection(
	firebase()
		.firestore()
		.collection('albums')
);
const album = new Document(
	firebase()
		.firestore()
		.doc('albums/myalbum')
);

// Get the reference
console.log(albums.ref.id);
console.log(album.ref.id);

// Or change the reference
albums.ref = undefined;
album.ref = firebase()
	.firestore()
	.doc('albums/myalbum2');
```

### Paths

Instead of using references directly, it is often more convenient and readable
to use `paths` instead. A collection path always consists of an **uneven** number
of fields; and a document path always has an **even** number of fields.

To use a path, pass in either a string to the contructor, or use the `path`
property.

```js
const artists = new Collection('artists');
const artist = new Document('artists/FooFighters');
const albums = new Collection('artists/FooFighters/albums');
const album = new Document('artists/FooFighters/albums/InYourHonor');

// Get the path
console.log(albums.path); // artists/FooFighters/albums

// Set the path
album.path = 'artists/FooFighters/albums/OneByOne';

// Reset the path/ref
artists.path = undefined;
```

_Paths and references can be intermixed. Under the hood, a path is simple
converted into a ref, and refs can be translated back into paths._

### Reactive Paths

* work in progress

```js
const artist = new Document('artists/FooFighters');
const albums = new Collection(() => artist.path + '/albums');
```
