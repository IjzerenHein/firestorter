### TypeScript support

Firestorter is written in TypeScript and supports TypeScript as first-class citizen.
It comes bundled with its own type-definitions so there is no need to import these separately.
To use Firestorter in TypeScript, use:

```ts
import * as firebase from "firebase/app";
import "firebase/firestore";
import { initFirestorter } from "firestorter";

// Initialize the main app
const app = firebase.initializeApp({
	...
});

// Optionally enable timestamps in snapshots
const firestore = app.firestore();
firestore.settings({ timestampsInSnapshots: true });

// Initialize firestorter
initFirestorter({ firebase });
```


### Additional types

Besides the Collection and Document classes, Firestorter contains additional types
which are needed when writing for instance custom Documents. These type-definitions
are located in:

[firestorter/lib/Types.ts](./src/Types.ts)

To import these types, use:

```ts
import { ICollectionOptions, CollectionQuery, IDocument } from 'firestorter/lib/Types';
...
```

### Collection generics

Collection can be extended to create and use your custom Document types.
In the following example, a custom document is used that adds several methods
to the standard Document class.

#### todo.ts

```ts
import { Document } from 'firestorter';
import { DocumentSource, IDocumentOptions } from 'firestorter/lib/Types';

class Todo extends Document {
	constructor(source: DocumentSource, options: IDocumentOptions) {
		super(source, {
			...(options || {}),
			schema: struct({
				finished: "boolean?",
				text: "string"
			})
		});
    }
    
    finish(): Promise<void> {
        return this.update({
            finished: true
        });
    }

    unfinish(): Promise<void> {
        return this.update({
            finished: false
        });
    }
}
```

#### todos.ts

```ts
import { Collection } from 'firestorter';
import { CollectionSource, ICollectionOptions } from 'firestorter/lib/Types';
import Todo from './Todo';

class Todos<Todo> extends Collection {
    constructor(source: CollectionSource, options: ICollectionOptions) {
        super(source, {
			...(options || {}),
			createDocument: (source: CollectionSource, options: ICollectionOptions) => new Todo(source, options)
		});
    }
}
```