# Sources, Paths & References

Collections and Documents can be initialized with 3 kinds of sources:

  * Paths (e.g. `"artists/FooFighters"`)
  * Reactive path functions (a `function` that returns a `path` based on some other content)
  * References (a `DocumentReference|CollectionReference` object returned by the Firestore API)

## Paths

Paths are probably the easiest way to set the source of a Collection or Document. A collection path always consists of an **uneven** number of fields; and a document path always has an **even** number of fields.

To use a path, pass in either a string as a source to the contructor, or use the `path`
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

## Reactive path functions

Reactive paths are functions that depend on observables (e.g. the `data` field of a Document)
and return a path. This makes it very easy to change the path of a Collection or
Document, based on the `path` or even `data` of another Document.


```js
const artist = new Document('artists/FooFighters');

// Let albums depend on the path of the artist document (subcollection)
const albums = new Collection(() => artist.path + '/albums');

// Change path of artist
artist.path = 'artists/Metallica';

// Albums path has now also changed
console.log(albums.path); // 'artists/Metallica/albums';
```

> [!NOTE]
> Reactive-paths behave smartly and only start collection/document snapshot updates when needed. When for instance the reactive path function of a sub-collection accesses the `data` field of a document, it will only start snapshot updates on that document when the subcollection is accessed.


## References

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

> [!NOTE]
> Paths and references can be intermixed. Under the hood, a path is simple
converted into a ref, and refs can be translated back into paths.


## Source Properties

The following properties exist on both `Collection` and `Document` to read and write the source configuration.

| Property | Data-type                                   | Access       | Action                                                                       |
| -------- | ------------------------------------------- | ------------ | ---------------------------------------------------------------------------- |
| `source` | `string,` `() => string,` `Reference`       | `read/write` | Configured source. Use this property in order to get or set a reactive-path. |
| `path`   | `string`                                    | `read/write` | Path of the collection or document.                                          |
| `ref`    | `DocumentReference,`  `CollectionReference` | `read/write` | Firestore Reference.                                                         |
| `id`     | `string`                                    | `read-only`  | Id *(last part of the path)* of either the collection or document.           |


## See also
- [Document class](./api/Document.md)
- [Collection class](./api/Collection.md)
- [Fetching data](./guides/FetchingData.md)
