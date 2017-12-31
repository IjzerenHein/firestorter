### Adding documents

Adding documents can be best done using Collection.add, which automatically assigns it a document ID:

```js
const todos = new Collection('todos');
const doc = await todos.add({
	finished: false,
	text: 'new task'
});
console.log(doc.id);
```

`Collection.add()` returns a Promise with the newly created document. If for whatever reason the operation failed (e.g. no permissions to add the document), the promise is rejected with the appropriate error.

Alternatively, you can use the Document interface to create documents with custom IDs:

```js
const todo = new Document('todos/mydoc');

// Use .set to create the document in the back-end
todo.set({
	finished: false,
	text: 'this is awesome'
});
```

### Updating documents

Updating documents can be done in 3 different ways:

* Update one or more fields
* Replace document contents
* Merge data into document

```js
const todo = new Document('todos/akskladlkasd887asj');

// Update one or more fields
await doc.update({
	finished: true,
	settings: {}
});

// Update a nested property using a field-path
await doc.update({
	'settings.foo.bar': 56
});

// Replace document content using .set
await doc.set({
	blank: true
});

// Merge data into the document
await doc.set({
	settings: {
		foo2: 'hello'
	}
}, {merge: true});
```

### Deleting documents

To delete a document, use Document.delete:

```js
const todo = new Document('todos/akskladlkasd887asj');
await doc.delete();
```

### Deleting collections

Work in progress, not yet supported
