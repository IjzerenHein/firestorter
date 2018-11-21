## Sub collections

Preliminary concept:

```js
import { Document, Collection } from 'firestorter';

// Document reference
const doc = new Document('artists/FooFighters');

// Create a collection, with a "smart" reference to the
// document path, and adding the sub-collection name.
const albums = new Collection(() => `${doc.path}/albums`);
```

_subject to change_
