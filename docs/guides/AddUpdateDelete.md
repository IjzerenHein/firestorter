# Adding documents

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

# Updating documents

Updating documents can be done in 3 different ways:

| Method                     | Action                                                                    |
| -------------------------- | ------------------------------------------------------------------------- |
| `.update(...)`             | Updates an existing document, but fails when document doesn't exist       |
| `.set(...)`                | Replaces whole document contents or create document if it doesn't exist   |
| `.set(..., {merge: true})` | Merges data into existing document or create document if it doesn't exist |


```js
import { getFirebase } from 'firestorter';
const todo = new Document('todos/akskladlkasd887asj');

// Update one or more fields
await todo.update({
  finished: true,
  settings: {}
});

// Update a nested property using a field-path
// This will only update `bar` and will leave all
// other properties in settings and foo untouched.
await todo.update({
  'settings.foo.bar': 56
});

// Properties can also be deleted entirely
// See: https://firebase.google.com/docs/firestore/manage-data/delete-data
await todo.update({
  'settings.foo': getFirebase().firestore.FieldValue.delete()
});
// Field-paths can be combined to update multiple
// properties/objects at once
await todo.update({
  'user.batman.isAwesome': true,
  'user.batman.secretName': 'Bruce Wayne'
  'user.batman.friends.robin': getFirebase().firestore.FieldValue.delete()
});

// Alternatively, you can use .set to create
// or completely overwrite documents
await todo.set({
  blank: true
});

// When {merge: true} is specified to .set, the provided
// data is merged in case the document already exists
await todo.set({
  settings: {
    foo2: 'hello'
  }
}, {merge: true});
```

# Deleting documents

To delete a document, use Document.delete:

```js
const todo = new Document('todos/akskladlkasd887asj');
await todo.delete();
```

## Deleting whole collections

Firestorter does not yet support deleting whole collections. In order to do that, delete all the documents explicitly and Firestore will delete the Collection automatically.
