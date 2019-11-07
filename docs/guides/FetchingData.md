# Fetching data

With Firestorter you can choose how data is fetched, either automatically **(recommended)** or manually. In `auto` mode, Firestorter automatically listens for Firestore updates *(snapshot listeners)* whenever a Collection or Document is accessed from within a MobX reactive function or an observer wrapped Component. Automatic mode is the default mode, if you are looking for **manual fetching** (e.g. for unit-tests), have a look at [fetch modes](./guides/FetchModes.md).

```jsx
import { Collection } from 'firestorter';
import { observer } from 'mobx-react';

...

const todos = new Collection('todos');

...

const TodoItem = observer(props => {
  const { doc } = props;
  const { message, finished } = doc.data;
  return <div>{`${message} is ${finished ? 'finished' : 'unfinished'}`}</div>;
});

const TodoList = observer(class TodoList extends React.Component {
  render() {
    const { docs, isLoading } = todos;
    return <div>
      {isLoading ? <span>Loading...</span> : undefined}
      {docs.map((doc) => (
        <TodoItem
          key={doc.id}
          doc={doc} />
      ))}
    </div>;
  }
});
```

## Automatic fetching

As seen in the example above, there is no explicit call to `fetch` in the code. This is because Firestorter uses MobX to determine whether the Collection or Document data is being accessed. If that is the case, then it will automatically start snapshot listeners and fetch data. And similarly, when data is no longer accessed, it cleans up any snapshot listeners.

In order for this "automatic" behavior to work, two things are needed:
- The `Component` needs to be wrapped in `observer`
- The `data/docs` needs to be accessed from the `render` function


## Special Note on Collections

The update/render mechanism for Collections is highly optimized and it is therefore important to apply it correctly. This way you will get the best performance and most efficient updates. The rule of thumb is:

- **Always** create a separate `List Component` and a separate `List-item Component`
- Wrap **both** Components with `observer`
- **Do not** access the `document.data` in the List Component (but **only** in the `List-item Component`)

These rules will enable the following behavior when `data` of a Document changes:

- **Only** the `List-item Component` that accessed that `Document.data` is re-rendered
- The `List Component` **is only** re-rendered when a Document is added/deleted, or the sort-order of the query changed


## Loading status

Whenever data is being loaded, the `isLoading` property is updated to reflect that status. This can be used to show a loading-indicator on the screen. Since Firestorter uses Firestore snapshot listeners that update automatically, the `isLoading` property is only set to `true` when an initial fetch is performed. After that, the Document/Collection is subscribed for real-time updates and any new snapshot updates don't trigger `isLoading` as they are instantly received.

If you want to know how `isLoading` behaves for manual fetching, have a [look here](./guides/FetchModes#isloading-behavior).


## Properties & methods

Firestorter exposes the following properties for accessing fetched data.

| Property    | Data-type | Class                                             | Action                                                                     |
| ----------- | --------- | ------------------------------------------------- | -------------------------------------------------------------------------- |
| `data`      | `object`  | `Document`                                        | Document data, as returned by a Firestore document snapshot.               |
| `hasData`   | `boolean` | `Document`                                        | `true` when the document has been successfully fetched and exists.         |
| `docs`      | `array`   | `Collection\|` `AggregateCollection\|` `GeoQuery` | Array of Documents                                                         |
| `hasDocs`   | `boolean` | `Collection\|` `AggregateCollection\|` `GeoQuery` | `true` when the collection has 1 or more documents.                        |
| `isLoading` | `boolean` | *all*                                             | `true` when the collection or document is loading (initial) data.          |
| `mode`      | `string`  | `Document\|Collection`                            | Fetch mode, manual or automatic. See [Fetch modes](./guides/FetchModes.md) |
| `snapshot`  | `object`  | `Document`                                        | Firestore snapshot object or `undefined` when no snapshot available.       |


And the following methods:

| Method  | Return-type     | Class                  | Action                                                                                                                                                                                                                                       |
| ------- | --------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fetch` | `Promise<this>` | `Document\|Collection` | Fetches new data/documents **(manual mode only)**                                                                                                                                                                                            |
| `ready` | `Promise`       | `Document\|Collection` | Waits for data to be available. When automatic-fetching is used, waits for the data to have been fetched at least once. When manual fetching is used, waits for the last `fetch` to complete or calls `fetch` when it has never been called. |



## See also
- [Document class](./api/Document.md)
- [Collection class](./api/Collection.md)
- [Fetch modes](./guides/FetchModes.md)
- [Queries](./guides/Queries.md)
- [Aggregate collections](./guides/AggregateCollections.md)
