## Queries

Using queries, you can filter, sort and limit the data that is returned in a Collection. Queries can be set in the constructor or afterwards using the `query` property.

### The Query Function

To set a query on a Collection, create a function that returns a [Firestore Query](https://firebase.google.com/docs/reference/js/firebase.firestore.Query) object. The function takes a [Firestore CollectionReference](https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference) as input and should return a Firestore Query. The function is "smart", in such a way that it is automatically re-evaluated whenever the `Collection.ref` changes or when an observable changes that was accessed inside the Query Function.

```js
const col = new Collection('todos', {
  query: (ref) => ref.where('finished', '==', false).limit(10)
});
```

Queries can also be set or re-set aftwards:

```js
const col = new Collection('todos');

// Show only the documents that not finished, with a max-limit of 10
col.query = (ref) => ref.where('finished', '==', false).limit(10);

// Reset query to show all data in the collection
col.query = undefined;
```

### Reactive Query Functions

When the Query Function accesses an observable, it will automatically be re-evaluated whenever that observable changes.

**React Example:**

```js
const TodosView extends Component {
  constructor(props) {
    super(props);
    this._pageLimit = observable.box(10);
    this._col = new Collection('todos', {
      query: (ref) => ref.limit(pageLimit)
    });
  }
  
  render() {
   return (
     <div>
       {this._col.docs.map(doc => <TodoItem doc={doc} />)}
     </div>
   );
  }
  
  onUpdatePageLimit = (limit) => {
    // Changing the observable will cause the query to be 
    // automatically re-evaluated with the new limit
    this._pageLimit.set(limit);
  };
}
```

Since `Document` objects are also observables, it is also possible
to link queries to document-data. In the following example, the Collection query is updated whenever the `showFinished` field in the `settings` Document is updated.

```js
const settingsDoc = new Document('settings');
const col = new Collection('todos', {
  query: (ref) => ref.where('finished', '==', settingsDoc.data.showFinished)
});
autorun(() => {
  console.log(col.docs);
});
```

### Disabling the Collection from within a Query

In some cases, the observed data inside the Query function indicates that the Collection should not query any data. In that case the query function may return `null` to disable the Collection.

```js
const userId = observable.box(undefined);
const col = new Collection('todos');

// Define query that selects all todos for a specific user,
// and disables the Collection when no user is selected.
col.query = (ref) => {
  const userId = userId.get();
  return userId
  	? ref.where('userId', '==', userId)  // Get todos for specific user
  	: null; // Disable collection when no user specified
};

...

// User logs in
userId.set('mjkhasdjk8278238223');

...

// User logs out
userId.set(undefined);
```

### Using explicit [Firestore Query](https://firebase.google.com/docs/reference/js/firebase.firestore.Query) references

[Firestore Query](https://firebase.google.com/docs/reference/js/firebase.firestore.Query) references can also be assigned directly to a Collection. For instance, like this:

```js
const col = new Collection('artists');
col.query = col.ref.where('name', '>=', 'D').orderBy('name', 'desc');
```
