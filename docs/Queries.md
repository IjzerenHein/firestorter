### Queries

Using queries, you can filter, sort and limit the data that is returned in a collection.
By default, when you create a Collection, it will fetch all the data in that collection.
Use the `query` property to set a [Firestore Query](https://firebase.google.com/docs/reference/js/firebase.firestore.Query) on the Collection.

```js
const todos = new Collection('todos');

// Show only the documents that not finished, with a max-limit of 10
todos.query = todos.ref.where('finished', '==', false).limit(10);

...

// By resetting the query, the Collection reverts to fetching
// all the documents in the collection
todos.query = undefined;
```

[Take a look at the Firestorter TodoApp, to see this query in action.](https://stackblitz.com/edit/react-firestore-todo-app?file=Todos.js)
