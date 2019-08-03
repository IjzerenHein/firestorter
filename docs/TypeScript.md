## TypeScript support

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

// Initialize firestorter
initFirestorter({ firebase });
```

### Document & Collection generics

The used data-type for documents and collections can be specified as such.

```ts
import { Document, Collection } from "firestorter";

type TodoType = {
	text: string;
	finished: boolean;
};

// Specify the document data-type
type TodoDoc = Document<TodoType>;
const todo = new TodoDoc();
const { data } = todo; // data is of type `TodoType`

// Will create documents with the type
const todos = new Collection<TodoDoc>("todos");
await todos.fetch();
const { data } = todos.docs[0]; // data is of type `TodoType`
```

### Additional types

Besides the Collection and Document classes, Firestorter contains additional types which are needed when writing for instance custom Documents. These type-definitions are located in:

[firestorter/lib/Types.ts](../src/Types.ts)

To import these types, use:

```ts
import { ICollectionOptions, CollectionQuery, IDocument } from 'firestorter/lib/Types';
...
```

To create for instance, a collection with a custom Document creator, use:

```ts
type TodoType = {
	text: string;
	finished: boolean;
};

class TodoDoc extends Document<TodoType> {
	setFinished(val: boolean): Promise<void> {
		return this.update({
			finished: val
		});
	}
}

class Todos extends Collection<TodoDoc> {
	constructor(source: CollectionSource, options: ICollectionOptions) {
		super(source, {
			...(options || {}),
			createDocument: (source: CollectionSource, options: ICollectionOptions) =>
				new TodoDoc(source, options)
		});
	}
}
```
