# Fetching data

With Firestorter you can choose how data is fetched, either automatically **(recommended)** or manually. In `auto` mode, Firestorter automatically listens for Firestore updates *(snapshot listeners)* whenever a Collection or Document is accessed from within a MobX reactive function or an observer wrapped Component.


```jsx
import { Collection } from 'firestorter';
import { observer } from 'mobx-react';

...

const todos = new Collection('todos');

...

const Todos = observer(class Todos extends React.Component {
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


## Fetch and data properties


| Entity      | Data-type  | Class                                             | Action                                                                       |
| ----------- | ---------- | ------------------------------------------------- | ---------------------------------------------------------------------------- |
| `data`      | `object`   | `Document`                                        | Configured source. Use this property in order to get or set a reactive-path. |
| `hasData`   | `boolean`  | `Document`                                        | Path of the collection or document.                                          |
| `docs`      | `array`    | `Collection\|` `AggregateCollection\|` `GeoQuery` | Firestore Reference.                                                         |
| `hasDocs`   | `boolean`  | `Collection\|` `AggregateCollection\|` `GeoQuery` | `true` when the collection contains 1 or more documents.                     |
| `isLoading` | `boolean`  | *all*                                             | `true` when the collection contains 1 or more documents.                     |
| `snapshot`  | `object`   | `Document\|Collection`                            | `true` when the collection contains 1 or more documents.                     |
| `fetch`     | `function` | `Document\|Collection`                            | `true` when the collection contains 1 or more documents.                     |
| `ready`     | `function` | `Document\|Collection`                            | `true` when the collection contains 1 or more documents.                     |



## Manual fetching

In order to use manual fetching, see [Fetch Modes](./guides/FetchModes.md)



## See also
- [Document class](./api/Document.md)
- [Collection class](./api/Collection.md)
- [Fetch modes](./guides/FetchModes.md)
- [Queries](./guides/Queries.md)
- [Aggregate collections](./guides/AggregateCollections.md)
